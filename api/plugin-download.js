import fs from 'node:fs';
import path from 'node:path';
import { Resend } from 'resend';
import {
  createPluginDownload,
  markPluginDownloadFailed,
  markPluginDownloadSent,
} from '../lib/database.js';
import { createPluginDownloadToken } from '../lib/plugin-download-token.js';
import { applyFormRateLimits, inspectFormRequest } from '../lib/request-security.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = 'https://dhreian.com';
const CONTACT_EMAIL = 'contact@dhreian.com';
const FROM_EMAIL = `dhreian plugins <${CONTACT_EMAIL}>`;
const LOGO_URL = `${SITE_URL}/email/dhreian-logo.png`;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DOWNLOADABLE_PLUGINS = {
  dhreverb: {
    name: 'dhreVerb',
    fileName: 'dhreVerb-1.0.0-windows-x64-installer.exe',
    downloadUrlEnvironmentVariable: 'DHREVERB_DOWNLOAD_URL',
  },
  dhrelink: {
    name: 'dhreLink',
    fileName: 'dhreLink-1.0.0-x64-Setup.exe',
    downloadUrlEnvironmentVariable: 'DHRELINK_DOWNLOAD_URL',
  },
};

function hasLocalInstallerFile(fileName) {
  if (!fileName) return false;
  const candidates = [
    path.join(process.cwd(), 'public', 'plugins', fileName),
    path.join(process.cwd(), 'public', 'tools', fileName),
    path.join(process.cwd(), 'public', 'downloads', fileName),
    path.join(process.cwd(), 'public', fileName),
    path.join(process.cwd(), 'private-assets', 'plugins', fileName),
    path.join(process.cwd(), 'private-assets', 'tools', fileName),
    path.join(process.cwd(), 'downloads', fileName),
    path.join(process.cwd(), fileName),
  ];

  return candidates.some((candidate) => fs.existsSync(candidate));
}

function hasConfiguredDownloadSource(plugin) {
  if (hasLocalInstallerFile(plugin.fileName)) {
    return true;
  }

  const value = String(process.env[plugin.downloadUrlEnvironmentVariable] || '').trim();

  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

const C = {
  accent: '#3881b5',
  accentLight: '#96c2de',
  accentMid: '#5fa1cc',
  accentDeep: '#266699',
  bg: '#000000',
  card: '#0a0a0c',
  panel: '#0d0d10',
  border: '#0e2a47',
  borderSubtle: '#1a1a20',
  white: '#ffffff',
  zinc200: '#e4e4e7',
  zinc400: '#a1a1aa',
  zinc500: '#71717a',
  zinc600: '#52525b',
};

const FONT_LOGO = "'Quintessential', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
const FONT_BODY = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

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
    subjectLine: (pluginName) => `¡Tu descarga de ${pluginName} está lista! - dhreian`,
    preheader: (pluginName) => `Tu enlace de descarga de ${pluginName} ya está disponible.`,
    eyebrow: 'Artista & Productor Musical',
    greeting: (name) => `Hola, ${name}:`,
    intro: (pluginName) =>
      `Gracias por descargar <strong style="color:${C.accentLight};font-weight:600;">${pluginName}</strong>.`,
    body:
      'Preparé el enlace para que puedas instalar el plugin y empezar a usarlo en tus sesiones.',
    summaryTitle: 'Resumen de tu descarga',
    labelName: 'Nombre',
    labelEmail: 'Email',
    labelPlugin: 'Plugin',
    ctaLead: 'Haz clic en el botón para descargar el instalador:',
    ctaLabel: 'Descargar Plugin',
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
    subjectLine: (pluginName) => `Your ${pluginName} download is ready! - dhreian`,
    preheader: (pluginName) => `Your ${pluginName} download link is ready.`,
    eyebrow: 'Artist & Music Producer',
    greeting: (name) => `Hi, ${name}:`,
    intro: (pluginName) =>
      `Thanks for downloading <strong style="color:${C.accentLight};font-weight:600;">${pluginName}</strong>.`,
    body: 'Your link is ready so you can install the plugin and start using it in your sessions.',
    summaryTitle: 'Your download summary',
    labelName: 'Name',
    labelEmail: 'Email',
    labelPlugin: 'Plugin',
    ctaLead: 'Click the button to download the installer:',
    ctaLabel: 'Download Plugin',
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

function getDownloadEmailHtml(c, { lang, name, email, pluginName, downloadUrl }) {
  const pStyle = `margin:0;color:${C.zinc400};line-height:1.75;font-size:15px;font-weight:300;font-family:${FONT_BODY};`;
  const labelStyle = `color:${C.zinc500};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;font-family:${FONT_BODY};padding:0 0 3px;`;
  const valueStyle = `color:${C.zinc200};font-size:14px;font-family:${FONT_BODY};padding:0 0 16px;`;
  const summaryRow = (label, value) => `
    <tr><td style="${labelStyle}">${label}</td></tr>
    <tr><td style="${valueStyle}">${value}</td></tr>`;
  const socialHtml = SOCIAL.map(
    (social) =>
      `<a href="${social.url}" target="_blank" style="color:${C.accentLight};font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.5px;text-decoration:none;">${social.label}</a>`
  ).join(`<span style="color:${C.zinc600};padding:0 9px;">&middot;</span>`);

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <style>
    :root{color-scheme:light dark;supported-color-schemes:light dark;}
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0;mso-table-rspace:0;}
    html,body{margin:0!important;padding:0!important;width:100%!important;background-color:${C.bg}!important;}
    .email-bg{background:${C.bg}!important;background-color:${C.bg}!important;}
    .email-card{background:${C.card}!important;background-color:${C.card}!important;}
    .email-panel{background:${C.panel}!important;background-color:${C.panel}!important;}
    @media only screen and (max-width:620px){.container{width:100%!important}.px{padding-left:24px!important;padding-right:24px!important}.logo{width:190px!important;height:auto!important}}
  </style>
</head>
<body class="email-bg" bgcolor="${C.bg}" style="margin:0;padding:0;background:${C.bg};background-color:${C.bg}!important;font-family:${FONT_BODY};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};opacity:0;">${c.preheader(pluginName)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};background-color:${C.bg}!important;">
    <tr><td class="email-bg" align="center" bgcolor="${C.bg}" style="padding:40px 16px;background:${C.bg};background-color:${C.bg}!important;">
      <table role="presentation" class="container email-card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="width:600px;max-width:600px;background:${C.card};background-color:${C.card}!important;border-radius:24px;border:1px solid ${C.borderSubtle};overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 50px -10px rgba(56,129,181,.4);">
        <tr><td height="4" bgcolor="${C.accentDeep}" style="height:4px;line-height:4px;font-size:0;background-color:${C.accentDeep};background-image:linear-gradient(90deg,${C.accent} 0%,${C.accentDeep} 100%);">&nbsp;</td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.card}" style="padding:44px 40px 30px;background:${C.card};background-color:${C.card}!important;border-bottom:1px solid ${C.borderSubtle};">
          <img class="logo" src="${LOGO_URL}" width="210" height="66" alt="dhreian" style="display:block;width:210px;max-width:210px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;color:${C.white};font-family:${FONT_LOGO};font-size:46px;line-height:1;" />
          <div style="color:${C.accentMid};font-size:11px;text-transform:uppercase;letter-spacing:4px;margin-top:14px;font-weight:700;font-family:${FONT_BODY};">${c.eyebrow}</div>
          <table role="presentation" width="140" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:18px auto 0;"><tr><td height="2" bgcolor="${C.accent}" style="height:2px;line-height:2px;font-size:0;background-color:${C.accent};background-image:linear-gradient(90deg,transparent,${C.accent},transparent);">&nbsp;</td></tr></table>
        </td></tr>
        <tr><td class="px email-card" bgcolor="${C.card}" style="padding:36px 40px 4px;background:${C.card};background-color:${C.card}!important;">
          <h1 style="font-family:${FONT_BODY};font-size:19px;margin:0 0 14px;color:${C.white};font-weight:600;">${c.greeting(name)}</h1>
          <p style="${pStyle}margin:0 0 16px;">${c.intro(pluginName)}</p>
          <p style="${pStyle}">${c.body}</p>
        </td></tr>
        <tr><td class="px email-card" bgcolor="${C.card}" style="padding:30px 40px 0;background:${C.card};background-color:${C.card}!important;">
          <table role="presentation" class="email-panel" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.panel}" style="background:${C.panel};background-color:${C.panel}!important;border-radius:18px;border:1px solid ${C.border};">
            <tr><td style="padding:26px 26px 12px;">
              <div style="font-family:${FONT_BODY};font-size:12px;margin:0 0 18px;color:${C.accentLight};text-transform:uppercase;letter-spacing:2.5px;font-weight:700;">${c.summaryTitle}</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${summaryRow(c.labelName, name)}
                ${summaryRow(c.labelEmail, `<a href="mailto:${email}" style="color:${C.accentLight};text-decoration:none;">${email}</a>`)}
                ${summaryRow(c.labelPlugin, pluginName)}
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.card}" style="padding:34px 40px 10px;background:${C.card};background-color:${C.card}!important;">
          <p style="${pStyle}text-align:center;margin:0 0 20px;">${c.ctaLead}</p>
          <a href="${downloadUrl}" target="_blank" style="display:inline-block;background-color:${C.accentDeep};background-image:linear-gradient(180deg,${C.accent} 0%,${C.accentDeep} 100%);color:#fff;font-family:${FONT_BODY};font-size:16px;font-weight:700;line-height:20px;text-decoration:none;padding:15px 42px;border-radius:16px;letter-spacing:.5px;box-shadow:0 0 25px rgba(56,129,181,.45);">${c.ctaLabel}</a>
          <p style="color:${C.zinc500};font-size:11px;line-height:1.6;margin:24px 0 6px;font-family:${FONT_BODY};">${c.fallbackLead}</p>
          <a href="${downloadUrl}" style="color:${C.accentLight};font-size:11px;line-height:1.6;word-break:break-all;font-family:${FONT_BODY};">${downloadUrl}</a>
        </td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.card}" style="padding:30px 40px 4px;background:${C.card};background-color:${C.card}!important;">
          <div style="color:${C.zinc500};font-size:10px;text-transform:uppercase;letter-spacing:3px;font-weight:700;font-family:${FONT_BODY};margin-bottom:14px;">${c.followLabel}</div>
          <div style="line-height:1.4;">${socialHtml}</div>
        </td></tr>
        <tr><td class="px email-card" align="center" bgcolor="${C.card}" style="padding:26px 40px 40px;background:${C.card};background-color:${C.card}!important;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${C.borderSubtle}" style="height:1px;line-height:1px;font-size:0;background-color:${C.borderSubtle};">&nbsp;</td></tr></table>
          <p style="color:${C.zinc600};font-size:11px;margin:24px 0 0;font-weight:300;letter-spacing:.4px;font-family:${FONT_BODY};line-height:1.6;">${c.footerAuto}</p>
          <p style="font-size:14px;margin:14px 0 0;font-family:${FONT_BODY};"><a href="${SITE_URL}" target="_blank" style="color:${C.accentLight};font-weight:600;letter-spacing:1px;text-decoration:none;">dhreian.com</a></p>
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
  const plugin = DOWNLOADABLE_PLUGINS[pluginKey];

  if (!name || !email || !pluginKey) {
    return res.status(400).json({ error: c.requiredFields });
  }

  if (name.length > 160 || email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: c.invalidFields });
  }

  if (!plugin) {
    return res.status(404).json({ error: c.pluginNotFound });
  }

  if (!hasConfiguredDownloadSource(plugin)) {
    console.error(`Falta configurar ${plugin.downloadUrlEnvironmentVariable}.`);
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
    const token = createPluginDownloadToken(pluginKey);
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
        pluginName: plugin.name,
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
    downloadUrl,
  };

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || FROM_EMAIL;
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      bcc: CONTACT_EMAIL,
      replyTo: CONTACT_EMAIL,
      subject: c.subjectLine(plugin.name),
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
