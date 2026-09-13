import fs from 'node:fs';
import path from 'node:path';

const installer = (version, fileName, publicPath) =>
  Object.freeze({ version, fileName, publicPath });

// Keep every published installer here. The download endpoint picks the highest
// version, while the site uses the same history for the version-information modal.
export const DOWNLOADABLE_PRODUCTS = Object.freeze({
  dhreverb: Object.freeze({
    name: 'dhreVerb',
    sourceUrlEnvironmentVariable: 'DHREVERB_DOWNLOAD_URL',
    versions: Object.freeze([
      installer(
        '1.0',
        'dhreVerb-1.0-windows-x64-installer.exe',
        'downloads/dhreverb/dhreVerb-1.0-windows-x64-installer.exe'
      ),
    ]),
  }),
  dhrelink: Object.freeze({
    name: 'dhreLink',
    sourceUrlEnvironmentVariable: 'DHRELINK_DOWNLOAD_URL',
    versions: Object.freeze([
      installer(
        '1.0',
        'dhreLink-v1.0-x64-Setup.exe',
        'downloads/dhrelink/dhreLink-v1.0-x64-Setup.exe'
      ),
    ]),
  }),
  dhreview: Object.freeze({
    name: 'dhreView',
    sourceUrlEnvironmentVariable: 'DHREVIEW_DOWNLOAD_URL',
    versions: Object.freeze([
      installer(
        '1.0',
        'dhreView-v1.0-x64-Setup.exe',
        'downloads/dhreview/dhreView-v1.0-x64-Setup.exe'
      ),
    ]),
  }),
});

export function getDownloadableProduct(productKey) {
  return DOWNLOADABLE_PRODUCTS[String(productKey || '').trim().toLowerCase()] || null;
}

function compareVersions(left, right) {
  const leftParts = String(left || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);
  const rightParts = String(right || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] || 0) - (rightParts[index] || 0);
    if (difference) return difference;
  }

  return 0;
}

export function getLatestProductVersion(product) {
  const versions = product?.versions || [];
  return versions.reduce(
    (latest, candidate) =>
      !latest || compareVersions(candidate.version, latest.version) > 0 ? candidate : latest,
    null
  );
}

export function getProductVersion(product, version) {
  return product?.versions?.find((candidate) => candidate.version === version) || null;
}

export function getLocalInstallerPath(productVersion) {
  if (!productVersion?.publicPath) return null;

  const filePath = path.join(process.cwd(), 'public', ...productVersion.publicPath.split('/'));
  return fs.existsSync(filePath) ? filePath : null;
}

export function getConfiguredSourceUrl(product, productVersion = getLatestProductVersion(product)) {
  const variableName =
    productVersion?.sourceUrlEnvironmentVariable || product?.sourceUrlEnvironmentVariable;
  const value = String(process.env[variableName] || '').trim();

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function hasDownloadSource(product, productVersion = getLatestProductVersion(product)) {
  return Boolean(
    productVersion &&
      (getLocalInstallerPath(productVersion) || getConfiguredSourceUrl(product, productVersion))
  );
}
