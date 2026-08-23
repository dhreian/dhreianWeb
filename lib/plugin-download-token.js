import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const TOKEN_LIFETIME_SECONDS = 24 * 60 * 60;
const TOKEN_CONTEXT = 'dhreian-plugin-download-v1';

function getSigningSecret() {
  const secret = process.env.PLUGIN_DOWNLOAD_SECRET || process.env.RATE_LIMIT_SECRET;

  if (!secret) {
    throw new Error('PLUGIN_DOWNLOAD_SECRET or RATE_LIMIT_SECRET must be configured.');
  }

  return secret;
}

function sign(encodedPayload) {
  return createHmac('sha256', getSigningSecret())
    .update(`${TOKEN_CONTEXT}:${encodedPayload}`)
    .digest();
}

export function createPluginDownloadToken(pluginKey) {
  const payload = {
    pluginKey,
    expiresAt: Math.floor(Date.now() / 1_000) + TOKEN_LIFETIME_SECONDS,
    nonce: randomBytes(16).toString('base64url'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(encodedPayload).toString('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyPluginDownloadToken(token) {
  try {
    const [encodedPayload, encodedSignature, extraPart] = String(token || '').split('.');
    if (!encodedPayload || !encodedSignature || extraPart) return null;

    const receivedSignature = Buffer.from(encodedSignature, 'base64url');
    const expectedSignature = sign(encodedPayload);

    if (
      receivedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1_000);

    if (
      typeof payload.pluginKey !== 'string' ||
      !/^[a-z0-9-]{1,100}$/.test(payload.pluginKey) ||
      !Number.isInteger(payload.expiresAt) ||
      payload.expiresAt <= now ||
      typeof payload.nonce !== 'string' ||
      payload.nonce.length < 16
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
