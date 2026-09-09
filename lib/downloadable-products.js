import fs from 'node:fs';
import path from 'node:path';

export const DOWNLOADABLE_PRODUCTS = Object.freeze({
  dhreverb: Object.freeze({
    name: 'dhreVerb',
    fileName: 'dhreVerb-1.0.0-windows-x64-installer.exe',
    publicPath: 'downloads/dhreverb/dhreVerb-1.0.0-windows-x64-installer.exe',
    sourceUrlEnvironmentVariable: 'DHREVERB_DOWNLOAD_URL',
  }),
  dhrelink: Object.freeze({
    name: 'dhreLink',
    fileName: 'dhreLink-1.0.0-x64-Setup.exe',
    publicPath: 'downloads/dhrelink/dhreLink-1.0.0-x64-Setup.exe',
    sourceUrlEnvironmentVariable: 'DHRELINK_DOWNLOAD_URL',
  }),
});

export function getDownloadableProduct(productKey) {
  return DOWNLOADABLE_PRODUCTS[String(productKey || '').trim().toLowerCase()] || null;
}

export function getLocalInstallerPath(product) {
  if (!product?.publicPath) return null;

  const filePath = path.join(process.cwd(), 'public', ...product.publicPath.split('/'));
  return fs.existsSync(filePath) ? filePath : null;
}

export function getConfiguredSourceUrl(product) {
  const value = String(process.env[product?.sourceUrlEnvironmentVariable] || '').trim();

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function hasDownloadSource(product) {
  return Boolean(getLocalInstallerPath(product) || getConfiguredSourceUrl(product));
}
