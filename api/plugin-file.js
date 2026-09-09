import fs from 'node:fs';
import { Readable } from 'node:stream';
import { verifyPluginDownloadToken } from '../lib/plugin-download-token.js';
import {
  getConfiguredSourceUrl,
  getDownloadableProduct,
  getLocalInstallerPath,
} from '../lib/downloadable-products.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = Array.isArray(req.query?.token) ? req.query.token[0] : req.query?.token;
  const payload = verifyPluginDownloadToken(token);
  const file = payload ? getDownloadableProduct(payload.pluginKey) : null;

  if (!file) {
    return res.status(403).json({ error: 'Download link is invalid or has expired.' });
  }

  const localFilePath = getLocalInstallerPath(file);

  if (localFilePath) {
    try {
      const stats = fs.statSync(localFilePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);

      return await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(localFilePath);
        stream.once('error', reject);
        res.once('finish', resolve);
        res.once('close', resolve);
        stream.pipe(res);
      });
    } catch (error) {
      console.error('Error al servir el instalador local:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Download is temporarily unavailable.' });
      }
      res.destroy(error);
      return undefined;
    }
  }

  let sourceUrl = getConfiguredSourceUrl(file);

  if (!sourceUrl) {
    const siteUrl = String(process.env.SITE_URL || 'https://dhreian.com').replace(/\/$/, '');
    sourceUrl = `${siteUrl}/${file.publicPath}`;
  }

  try {
    const upstream = await fetch(sourceUrl, {
      headers: { 'User-Agent': 'dhreian-download-service/1.0' },
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      console.error(`El almacenamiento del plugin respondió con estado ${upstream.status}.`);
      return res.status(502).json({ error: 'Download is temporarily unavailable.' });
    }

    const contentLength = upstream.headers.get('content-length');
    if (contentLength) res.setHeader('Content-Length', contentLength);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);

    return await new Promise((resolve, reject) => {
      const stream = Readable.fromWeb(upstream.body);
      stream.once('error', reject);
      res.once('finish', resolve);
      res.once('close', resolve);
      stream.pipe(res);
    });
  } catch (error) {
    console.error('Error al servir el instalador privado:', error);

    if (!res.headersSent) {
      return res.status(500).json({ error: 'Download is temporarily unavailable.' });
    }

    res.destroy(error);
    return undefined;
  }
}
