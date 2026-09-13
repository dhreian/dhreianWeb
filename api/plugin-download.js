import { Resend } from 'resend';
import {
  createPluginDownload,
  markPluginDownloadFailed,
  markPluginDownloadSent,
} from '../lib/database.js';
import { createPluginDownloadToken } from '../lib/plugin-download-token.js';
import { applyFormRateLimits, inspectFormRequest } from '../lib/request-security.js';
import {
  getDownloadableProduct,
  getLatestProductVersion,
  hasDownloadSource,
} from '../lib/downloadable-products.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = 'https://dhreian.com';
const CONTACT_EMAIL = 'contact@dhreian.com';
const FROM_EMAIL = `dhreian plugins <${CONTACT_EMAIL}>`;
const LOGO_URL = `${SITE_URL}/email/dhreian-mark-purple.png`;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const C = {
  accent: '#874dfa',
  bg: '#000000',
  panel: '#101014',
  border: '#34313b',
  white: '#ffffff',
  muted: '#aaa4b1',
};

const FONT_BODY = "'Cormorant Infant', Georgia, serif";

const SOCIAL = [
  { label: 'Spotify', url: 'https://open.spotify.com/intl-es/artist/5Sv40N0flsAfHMxy6NrB1m' },
  { label: 'YouTube', url: 'https://www.youtube.com/@dhreian' },
  { label: 'Instagram', url: 'https://instagram.com/dhreian' },
  { label: 'TikTok', url: 'https://tiktok.com/@dhreian_' },
  { label: 'X', url: 'https://x.com/dhreian' },
];

const COPY = {
  es: {
    methodNotAllowed: 'Método no permitido',
    requiredFields: 'Nombre y correo son requeridos.',
    invalidFields: 'Revisa los datos ingresados e inténtalo nuevamente.',
    pluginNotFound: 'El plugin solicitado no está disponible.',
    processError: 'No pude enviar el enlace. Inténtalo nuevamente.',
    serverError: 'Error interno del servidor.',
    subjectLine: (pluginName, version) =>
      `Tu descarga de ${pluginName} v${version} está lista - dhreian`,
    preheader: (pluginName, version) =>
      `Tu enlace para descargar ${pluginName} v${version} ya está disponible.`,
    eyebrow: 'artista • productor • desarrollador',
    greeting: (name) => `Hola, ${name}:`,
    intro: (pluginName) =>
      `Gracias por descargar <strong style="color:${C.accent};font-weight:600;">${pluginName}</strong>.`,
    body:
      'Preparé el enlace de la versión más reciente para que puedas instalarla y usarla en tus sesiones.',
    summaryTitle: 'Resumen de tu descarga',
    labelName: 'Nombre',
    labelEmail: 'Email',
    labelPlugin: 'Plugin',
    labelVersion: 'Versión',
    ctaLead: 'Haz clic para descargar el instalador:',
    ctaLabel: 'Descargar instalador',
    fallbackLead: 'Si el botón no funciona, copia este enlace:',
    followLabel: 'Sígueme',
    footerAuto: 'Este es un mensaje automático para confirmar tu solicitud de descarga.',
  },
  en: {
    methodNotAllowed: 'Method not allowed',
    requiredFields: 'Name and email are required.',
    invalidFields: 'Check the information you entered and try again.',
    pluginNotFound: 'The requested plugin is not available.',
    processError: 'I could not send the link. Please try again.',
    serverError: 'Internal server error.',
    subjectLine: (pluginName, version) =>
      `Your ${pluginName} v${version} download is ready - dhreian`,
    preheader: (pluginName, version) =>
      `Your link to download ${pluginName} v${version} is ready.`,
    eyebrow: 'artist • producer • developer',
    greeting: (name) => `Hi, ${name}:`,
    intro: (pluginName) =>
      `Thanks for downloading <strong style="color:${C.accent};font-weight:600;">${pluginName}</strong>.`,
    body: 'Your latest-version link is ready so you can install it and start using it in your sessions.',
    summaryTitle: 'Your download summary',
    labelName: 'Name',
    labelEmail: 'Email',
    labelPlugin: 'Plugin',
    labelVersion: 'Version',
    ctaLead: 'Click the button to download the installer:',
    ctaLabel: 'Download installer',
    fallbackLead: 'If the button does not work, copy this link:',
    followLabel: 'Follow me',
    footerAuto: 'This is an automated message confirming your download request.',
  },
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getDownloadEmailHtml(c, { lang, name, email, pluginName, version, downloadUrl }) {
  const pStyle = `margin:0;color:${C.white};line-height:1.65;font-size:16px;font-weight:400;font-family:${FONT_BODY};`;
  const labelStyle = `color:${C.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:${FONT_BODY};padding:0 0 3px;`;
  const valueStyle = `color:${C.white};font-size:14px;font-family:${FONT_BODY};padding:0 0 16px;word-break:break-word;`;
  const summaryRow = (label, value) => `
    <tr><td style="${labelStyle}">${label}</td></tr>
    <tr><td style="${valueStyle}">${value}</td></tr>`;
  const socialHtml = SOCIAL.map(
    (social) =>
      `<a href="${social.url}" target="_blank" style="color:${C.accent};font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.5px;text-decoration:underline;">${social.label}</a>`
  ).join(`<span style="color:${C.muted};padding:0 9px;">&middot;</span>`);

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <style>
    :root{color-scheme:dark;supported-color-schemes:dark;}
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0;mso-table-rspace:0;}
    img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
    html,body{margin:0!important;padding:0!important;width:100%!important;background-color:${C.bg}!important;}
    .email-bg{background:${C.bg}!important;background-color:${C.bg}!important;}
    .email-card{background:${C.bg}!important;background-color:${C.bg}!important;}
    .email-panel{background:${C.panel}!important;background-color:${C.panel}!important;}
    @media only screen and (max-width:620px){.container{width:100%!important}.px{padding-left:24px!important;padding-right:24px!important}}
  </style>
</head>
<body class="email-bg" bgcolor="${C.bg}" style="margin:0;padding:0;background:${C.bg};background-color:${C.bg}!important;font-family:${FONT_BODY};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};opacity:0;">${c.preheader(pluginName, version)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};background-color:${C.bg}!important;">
    <tr><td class="email-bg" align="center" bgcolor="${C.bg}" style="padding:32px 16px;background:${C.bg};background-color:${C.bg}!important;">
      <table role="presentation" class="container email-card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="width:600px;max-width:600px;background:${C.bg};background-color:${C.bg}!important;border:1px solid ${C.border};">
        <tr><td height="2" bgcolor="${C.accent}" style="height:2px;line-height:2px;font-size:0;background-color:${C.accent};">&nbsp;</td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.bg}" style="padding:32px 40px 28px;background:${C.bg};background-color:${C.bg}!important;border-bottom:1px solid ${C.border};">
          <img src="${LOGO_URL}" width="76" height="76" alt="dhreian" style="display:block;width:76px;max-width:76px;height:76px;margin:0 auto;" />
          <div style="color:${C.white};font-size:22px;line-height:1;margin-top:12px;font-weight:600;font-family:${FONT_BODY};">dhreian</div>
          <div style="color:${C.muted};font-size:11px;letter-spacing:2.4px;margin-top:10px;font-weight:700;font-family:${FONT_BODY};">${c.eyebrow}</div>
        </td></tr>
        <tr><td class="px email-card" bgcolor="${C.bg}" style="padding:32px 40px 4px;background:${C.bg};background-color:${C.bg}!important;">
          <h1 style="font-family:${FONT_BODY};font-size:24px;margin:0 0 14px;color:${C.white};font-weight:600;">${c.greeting(name)}</h1>
          <p style="${pStyle}margin:0 0 16px;">${c.intro(pluginName)}</p>
          <p style="${pStyle}">${c.body}</p>
        </td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.bg}" style="padding:22px 40px 8px;background:${C.bg};background-color:${C.bg}!important;">
          <p style="${pStyle}text-align:center;margin:0 0 20px;">${c.ctaLead}</p>
          <a href="${downloadUrl}" target="_blank" style="display:inline-block;background-color:${C.accent};color:${C.white};font-family:${FONT_BODY};font-size:16px;font-weight:700;line-height:20px;text-decoration:none;padding:14px 32px;border:1px solid ${C.accent};">${c.ctaLabel}</a>
          <p style="color:${C.muted};font-size:11px;line-height:1.6;margin:24px 0 6px;font-family:${FONT_BODY};">${c.fallbackLead}</p>
          <a href="${downloadUrl}" style="color:${C.accent};font-size:11px;line-height:1.6;word-break:break-all;font-family:${FONT_BODY};">${downloadUrl}</a>
        </td></tr>
        <tr><td class="px email-card" bgcolor="${C.bg}" style="padding:28px 40px 0;background:${C.bg};background-color:${C.bg}!important;">
          <table role="presentation" class="email-panel" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.panel}" style="background:${C.panel};background-color:${C.panel}!important;border:1px solid ${C.border};">
            <tr><td style="padding:22px 24px 8px;">
              <div style="font-family:${FONT_BODY};font-size:15px;margin:0 0 18px;color:${C.white};font-weight:700;">${c.summaryTitle}</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${summaryRow(c.labelName, name)}
                ${summaryRow(c.labelEmail, `<a href="mailto:${email}" style="color:${C.accent};text-decoration:none;">${email}</a>`)}
                ${summaryRow(c.labelPlugin, pluginName)}
                ${summaryRow(c.labelVersion, version)}
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.bg}" style="padding:26px 40px 4px;background:${C.bg};background-color:${C.bg}!important;">
          <div style="color:${C.muted};font-size:10px;text-transform:uppercase;letter-spacing:3px;font-weight:700;font-family:${FONT_BODY};margin-bottom:14px;">${c.followLabel}</div>
          <div style="line-height:1.4;">${socialHtml}</div>
        </td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.bg}" style="padding:26px 40px 32px;background:${C.bg};background-color:${C.bg}!important;border-top:1px solid ${C.border};">
          <p style="color:${C.muted};font-size:11px;margin:0;font-weight:400;letter-spacing:.2px;font-family:${FONT_BODY};line-height:1.6;">${c.footerAuto}</p>
          <p style="font-size:14px;margin:14px 0 0;font-family:${FONT_BODY};"><a href="${SITE_URL}" target="_blank" style="color:${C.accent};font-weight:700;letter-spacing:.6px;text-decoration:underline;">dhreian.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  const lang = req.body?.lang === 'en' ? 'en' : 'es';
  const c = COPY[lang];

  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: c.methodNotAllowed });
  }

  const requestInspection = inspectFormRequest(req);

  if (requestInspection.automated) {
    return res.status(200).json({ success: true });
  }

  if (!requestInspection.ok) {
    return res.status(requestInspection.status).json({ error: c.invalidFields });
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const pluginKey = String(req.body?.pluginKey || '').trim().toLowerCase();
  const plugin = getDownloadableProduct(pluginKey);
  const latestVersion = plugin ? getLatestProductVersion(plugin) : null;

  if (!name || !email || !pluginKey) {
    return res.status(400).json({ error: c.requiredFields });
  }

  if (name.length > 160 || email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: c.invalidFields });
  }

  if (!plugin || !latestVersion) {
    return res.status(404).json({ error: c.pluginNotFound });
  }

  if (!hasDownloadSource(plugin, latestVersion)) {
    console.error(`Falta configurar ${plugin.sourceUrlEnvironmentVariable}.`);
    return res.status(503).json({ error: c.processError });
  }

  if (process.env.DATABASE_URL) {
    try {
      const rateLimit = await applyFormRateLimits(req, {
        route: 'plugin-download',
        email,
      });

      if (!rateLimit.allowed) {
        res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
        return res.status(429).json({ error: c.processError });
      }
    } catch (error) {
      console.warn('Advertencia al aplicar los límites de descarga (continuando):', error.message);
    }
  }

  let downloadUrl;

  try {
    const token = createPluginDownloadToken(pluginKey, latestVersion.version);
    const siteUrl = String(process.env.SITE_URL || SITE_URL).replace(/\/$/, '');
    downloadUrl = `${siteUrl}/api/plugin-file?token=${encodeURIComponent(token)}`;
  } catch (error) {
    console.error('Error al crear el enlace temporal del plugin:', error);
    return res.status(500).json({ error: c.serverError });
  }

  let downloadId = null;

  if (process.env.DATABASE_URL) {
    try {
      downloadId = await createPluginDownload({
        name,
        email,
        pluginKey,
        pluginName: `${plugin.name} v${latestVersion.version}`,
        downloadUrl,
        language: lang,
      });
    } catch (error) {
      console.warn('Advertencia al guardar la descarga en Neon (continuando):', error.message);
    }
  }

  const safe = {
    lang,
    name: escapeHtml(name),
    email: escapeHtml(email),
    pluginName: escapeHtml(plugin.name),
    version: escapeHtml(latestVersion.version),
    downloadUrl,
  };

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || FROM_EMAIL;
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      bcc: CONTACT_EMAIL,
      replyTo: CONTACT_EMAIL,
      subject: c.subjectLine(plugin.name, latestVersion.version),
      html: getDownloadEmailHtml(c, safe),
    });

    if (error) {
      console.error('Error reportado por Resend al enviar la descarga:', error);
      if (downloadId) {
        try {
          await markPluginDownloadFailed(downloadId, error.message || c.processError);
        } catch (databaseError) {
          console.error('Error al actualizar la descarga fallida en Neon:', databaseError);
        }
      }
      return res.status(400).json({ error: c.processError });
    }

    if (downloadId) {
      try {
        await markPluginDownloadSent(downloadId, data?.id);
      } catch (databaseError) {
        console.error('El enlace se envió, pero no se actualizó su estado en Neon:', databaseError);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error interno al enviar el enlace con Resend:', error);
    if (downloadId) {
      try {
        await markPluginDownloadFailed(downloadId, error.message || c.serverError);
      } catch (databaseError) {
        console.error('Error al actualizar la descarga fallida en Neon:', databaseError);
      }
    }
    return res.status(500).json({ error: c.serverError });
  }
}
