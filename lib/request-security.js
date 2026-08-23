import { createHmac } from 'node:crypto';
import { consumeRateLimit } from './database.js';

const PRIMARY_ORIGINS = new Set([
  'https://dhreian.com',
  'https://www.dhreian.com',
]);

const MINIMUM_COMPLETION_TIME_MS = 1_000;

const RATE_LIMITS = {
  contact: {
    ip: { limit: 5, windowMs: 15 * 60 * 1_000 },
    email: { limit: 3, windowMs: 60 * 60 * 1_000 },
  },
  'plugin-download': {
    ip: { limit: 5, windowMs: 15 * 60 * 1_000 },
    email: { limit: 3, windowMs: 24 * 60 * 60 * 1_000 },
  },
};

function getHeader(req, name) {
  const value = req.headers?.[name];
  return Array.isArray(value) ? value[0] : String(value || '');
}

function getAllowedOrigins() {
  const allowedOrigins = new Set(PRIMARY_ORIGINS);
  const deploymentHost = String(process.env.VERCEL_URL || '').trim();

  if (deploymentHost) {
    allowedOrigins.add(`https://${deploymentHost}`);
  }

  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://localhost:5173');
    allowedOrigins.add('http://127.0.0.1:3000');
    allowedOrigins.add('http://127.0.0.1:5173');
  }

  return allowedOrigins;
}

function hasTrustedOrigin(req) {
  const fetchSite = getHeader(req, 'sec-fetch-site').toLowerCase();
  if (fetchSite === 'cross-site') return false;

  const origin = getHeader(req, 'origin').trim();
  if (!origin) return true;

  try {
    return getAllowedOrigins().has(new URL(origin).origin);
  } catch {
    return false;
  }
}

function getClientAddress(req) {
  const forwarded =
    getHeader(req, 'x-vercel-forwarded-for') ||
    getHeader(req, 'x-forwarded-for') ||
    getHeader(req, 'x-real-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  return String(req.socket?.remoteAddress || 'unknown').trim();
}

function getHashSecret() {
  const secret = process.env.RATE_LIMIT_SECRET || process.env.DATABASE_URL;

  if (!secret) {
    throw new Error('RATE_LIMIT_SECRET or DATABASE_URL must be configured.');
  }

  return secret;
}

function hashIdentifier(route, scope, identifier) {
  return createHmac('sha256', getHashSecret())
    .update(`${route}:${scope}:${String(identifier).trim().toLowerCase()}`)
    .digest('hex');
}

export function inspectFormRequest(req) {
  const contentType = getHeader(req, 'content-type').toLowerCase();

  if (!contentType.startsWith('application/json')) {
    return { ok: false, status: 415 };
  }

  if (!hasTrustedOrigin(req)) {
    return { ok: false, status: 403 };
  }

  if (String(req.body?.website || '').trim()) {
    return { ok: true, automated: true };
  }

  const startedAt = Number(req.body?.startedAt);
  const elapsed = Date.now() - startedAt;

  if (
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    elapsed < MINIMUM_COMPLETION_TIME_MS
  ) {
    return { ok: false, status: 400 };
  }

  return { ok: true, automated: false };
}

export async function applyFormRateLimits(req, { route, email }) {
  const routeLimits = RATE_LIMITS[route];
  if (!routeLimits) throw new Error(`Unknown rate-limit route: ${route}`);

  const identifiers = [
    {
      scope: 'ip',
      value: getClientAddress(req),
      ...routeLimits.ip,
    },
    {
      scope: 'email',
      value: email,
      ...routeLimits.email,
    },
  ];

  for (const identifier of identifiers) {
    const result = await consumeRateLimit({
      endpoint: route,
      identifierHash: hashIdentifier(route, identifier.scope, identifier.value),
      limit: identifier.limit,
      windowMs: identifier.windowMs,
    });

    if (!result.allowed) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(identifier.windowMs / 1_000),
      };
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
