import { neon } from '@neondatabase/serverless';

let sqlClient;
let schemaPromise;

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  sqlClient ||= neon(process.env.DATABASE_URL);
  return sqlClient;
}

export async function ensureDatabaseSchema() {
  if (!schemaPromise) {
    const sql = getSql();

    schemaPromise = sql.transaction([
      sql`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(160) NOT NULL,
          email VARCHAR(320) NOT NULL,
          subject VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          language VARCHAR(2) NOT NULL CHECK (language IN ('es', 'en')),
          status VARCHAR(16) NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'sent', 'failed')),
          resend_email_id VARCHAR(160),
          error_message TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          sent_at TIMESTAMPTZ
        )
      `,

      sql`
        CREATE TABLE IF NOT EXISTS plugin_downloads (
          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(160) NOT NULL,
          email VARCHAR(320) NOT NULL,
          plugin_key VARCHAR(100) NOT NULL,
          plugin_name VARCHAR(160) NOT NULL,
          download_url TEXT NOT NULL,
          language VARCHAR(2) NOT NULL CHECK (language IN ('es', 'en')),
          status VARCHAR(16) NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'sent', 'failed')),
          resend_email_id VARCHAR(160),
          error_message TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          sent_at TIMESTAMPTZ
        )
      `,

      sql`
        CREATE TABLE IF NOT EXISTS api_rate_limits (
          endpoint VARCHAR(64) NOT NULL,
          identifier_hash CHAR(64) NOT NULL,
          window_started_at TIMESTAMPTZ NOT NULL,
          request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count > 0),
          expires_at TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (endpoint, identifier_hash, window_started_at)
        )
      `,

      sql`
        CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
        ON contact_submissions (created_at DESC)
      `,

      sql`
        CREATE INDEX IF NOT EXISTS contact_submissions_email_idx
        ON contact_submissions (LOWER(email))
      `,

      sql`
        CREATE INDEX IF NOT EXISTS plugin_downloads_created_at_idx
        ON plugin_downloads (created_at DESC)
      `,

      sql`
        CREATE INDEX IF NOT EXISTS plugin_downloads_email_plugin_idx
        ON plugin_downloads (LOWER(email), plugin_key)
      `,

      sql`
        CREATE INDEX IF NOT EXISTS api_rate_limits_expires_at_idx
        ON api_rate_limits (expires_at)
      `,
    ]).catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }

  return schemaPromise;
}

export async function createContactSubmission({ name, email, subject, message, language }) {
  await ensureDatabaseSchema();
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO contact_submissions (name, email, subject, message, language)
    VALUES (${name}, ${email}, ${subject}, ${message}, ${language})
    RETURNING id
  `;
  return row.id;
}

export async function createPluginDownload({
  name,
  email,
  pluginKey,
  pluginName,
  downloadUrl,
  language,
}) {
  await ensureDatabaseSchema();
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO plugin_downloads (
      name,
      email,
      plugin_key,
      plugin_name,
      download_url,
      language
    )
    VALUES (${name}, ${email}, ${pluginKey}, ${pluginName}, ${downloadUrl}, ${language})
    RETURNING id
  `;
  return row.id;
}

export async function markContactSubmissionSent(id, resendEmailId) {
  const sql = getSql();
  await sql`
    UPDATE contact_submissions
    SET status = 'sent', resend_email_id = ${resendEmailId || null}, sent_at = NOW()
    WHERE id = ${id}
  `;
}

export async function markContactSubmissionFailed(id, errorMessage) {
  const sql = getSql();
  await sql`
    UPDATE contact_submissions
    SET status = 'failed', error_message = ${String(errorMessage || '').slice(0, 1000)}
    WHERE id = ${id}
  `;
}

export async function markPluginDownloadSent(id, resendEmailId) {
  const sql = getSql();
  await sql`
    UPDATE plugin_downloads
    SET status = 'sent', resend_email_id = ${resendEmailId || null}, sent_at = NOW()
    WHERE id = ${id}
  `;
}

export async function markPluginDownloadFailed(id, errorMessage) {
  const sql = getSql();
  await sql`
    UPDATE plugin_downloads
    SET status = 'failed', error_message = ${String(errorMessage || '').slice(0, 1000)}
    WHERE id = ${id}
  `;
}

export async function consumeRateLimit({ endpoint, identifierHash, limit, windowMs }) {
  await ensureDatabaseSchema();
  const sql = getSql();
  const now = Date.now();
  const windowStartedAt = new Date(Math.floor(now / windowMs) * windowMs).toISOString();
  const expiresAt = new Date(Math.floor(now / windowMs) * windowMs + windowMs).toISOString();

  const [row] = await sql`
    INSERT INTO api_rate_limits (
      endpoint,
      identifier_hash,
      window_started_at,
      request_count,
      expires_at
    )
    VALUES (${endpoint}, ${identifierHash}, ${windowStartedAt}, 1, ${expiresAt})
    ON CONFLICT (endpoint, identifier_hash, window_started_at)
    DO UPDATE SET request_count = api_rate_limits.request_count + 1
    RETURNING request_count
  `;

  if (Number(row.request_count) === 1) {
    await sql`DELETE FROM api_rate_limits WHERE expires_at < NOW()`;
  }

  return {
    allowed: Number(row.request_count) <= limit,
    count: Number(row.request_count),
  };
}
