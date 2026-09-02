import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import {
  INDEXABLE_ROUTES,
  getPageMetadata,
  getStructuredData,
} from '../src/seo/metadata.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'dist');
const templatePath = path.join(outputDirectory, 'index.html');

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceAttribute(tag, attribute, value) {
  const escapedValue = escapeHtmlAttribute(value);
  const attributePattern = new RegExp(`(${attribute}=")[^"]*(")`, 'i');
  return tag.replace(attributePattern, `$1${escapedValue}$2`);
}

function replaceTagAttribute(html, tagPattern, attribute, value) {
  return html.replace(tagPattern, (tag) => replaceAttribute(tag, attribute, value));
}

function injectMetadata(template, metadata, structuredData, renderedApp) {
  let html = template;

  html = replaceTagAttribute(html, /<html\b[^>]*\blang="[^"]*"[^>]*>/i, 'lang', metadata.lang);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttribute(metadata.title)}</title>`);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bname="description"[^>]*>/i, 'content', metadata.description);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:type"[^>]*>/i, 'content', metadata.ogType);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:title"[^>]*>/i, 'content', metadata.title);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:description"[^>]*>/i, 'content', metadata.socialDescription);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:url"[^>]*>/i, 'content', metadata.canonical);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:image"[^>]*>/i, 'content', metadata.image);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:image:secure_url"[^>]*>/i, 'content', metadata.image);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:image:alt"[^>]*>/i, 'content', metadata.imageAlt);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bproperty="og:locale"[^>]*>/i, 'content', metadata.locale);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bname="twitter:title"[^>]*>/i, 'content', metadata.title);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bname="twitter:description"[^>]*>/i, 'content', metadata.socialDescription);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bname="twitter:image"[^>]*>/i, 'content', metadata.image);
  html = replaceTagAttribute(html, /<meta\b[^>]*\bname="twitter:image:alt"[^>]*>/i, 'content', metadata.imageAlt);
  html = replaceTagAttribute(html, /<link\b[^>]*\brel="canonical"[^>]*>/i, 'href', metadata.canonical);
  html = replaceTagAttribute(html, /<link\b[^>]*\bhreflang="es"[^>]*>/i, 'href', metadata.canonical);
  html = replaceTagAttribute(html, /<link\b[^>]*\bhreflang="x-default"[^>]*>/i, 'href', metadata.canonical);

  const serializedData = JSON.stringify(structuredData, null, 2).replaceAll('<', '\\u003c');
  html = html.replace(
    /<script\b[^>]*\bid="structured-data"[^>]*>[\s\S]*?<\/script>/i,
    `<script id="structured-data" type="application/ld+json">\n${serializedData}\n    </script>`
  );
  html = html.replace(/<div id="root"><\/div>/i, `<div id="root">${renderedApp}</div>`);

  return html;
}

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const template = await fs.readFile(templatePath, 'utf8');
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const renderedApp = render();

  for (const route of INDEXABLE_ROUTES) {
    const metadata = getPageMetadata(route, 'es');
    const html = injectMetadata(
      template,
      metadata,
      getStructuredData(route, 'es'),
      renderedApp
    );
    const filename = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    await fs.writeFile(path.join(outputDirectory, filename), html, 'utf8');
  }
} finally {
  await vite.close();
}
