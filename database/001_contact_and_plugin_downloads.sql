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
);

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
);

CREATE TABLE IF NOT EXISTS api_rate_limits (
  endpoint VARCHAR(64) NOT NULL,
  identifier_hash CHAR(64) NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count > 0),
  expires_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (endpoint, identifier_hash, window_started_at)
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
  ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_email_idx
  ON contact_submissions (LOWER(email));
CREATE INDEX IF NOT EXISTS plugin_downloads_created_at_idx
  ON plugin_downloads (created_at DESC);
CREATE INDEX IF NOT EXISTS plugin_downloads_email_plugin_idx
  ON plugin_downloads (LOWER(email), plugin_key);
CREATE INDEX IF NOT EXISTS api_rate_limits_expires_at_idx
  ON api_rate_limits (expires_at);
