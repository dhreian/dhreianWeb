import { Resend } from 'resend';
import {
  createContactSubmission,
  markContactSubmissionFailed,
  markContactSubmissionSent,
} from '../lib/database.js';
import { applyFormRateLimits, inspectFormRequest } from '../lib/request-security.js';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeEmailHeader(str = '') {
  return String(str).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const C = {
  purple: '#681cff',
  purpleDark: '#4b0aab',
  purpleDeep: '#32106f',
  bg: '#f7f5fb',
  card: '#ffffff',
  panel: '#f1edff',
  border: '#dfd5f5',
  borderSubtle: '#ebe6f4',
  white: '#ffffff',
  ink: '#17121f',
  inkSoft: '#554c63',
  muted: '#7b7287',
};

const FONT_LOGO = "'Cormorant Infant', Georgia, serif";
const FONT_BODY = "'Cormorant Infant', Georgia, serif";

const SITE_URL = 'https://dhreian.com';
const LOGO_URL = `${SITE_URL}/email/dhreian-mark-purple.svg`;
const CONTACT_EMAIL = 'contact@dhreian.com';
const FROM_EMAIL = `dhreian contact <${CONTACT_EMAIL}>`;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    requiredFields: 'Todos los campos son requeridos.',
    invalidFields: 'Revisa los datos ingresados e inténtalo nuevamente.',
    processError: 'Error al procesar el mensaje.',
    serverError: 'Error interno del servidor.',
    subjectLine: (subject) => `¡He recibido tu mensaje! - ${subject} - dhreian`,
    preheader: 'He recibido tu mensaje y te responderé personalmente muy pronto.',
    eyebrow: 'Artista & Productor Musical',
    greeting: (name) => `Hola, ${name}:`,
    intro: (subjectLower) =>
      `Gracias por ponerte en contacto. He recibido correctamente tu mensaje sobre <strong style="color:${C.purpleDark};font-weight:600;">${subjectLower}</strong>.`,
    body2:
      'Ya estoy revisando tu propuesta. Te escribiré a la brevedad con detalles personalizados y los siguientes pasos para tu proyecto.',
    summaryTitle: 'Resumen de tu solicitud',
    labelName: 'Nombre',
    labelEmail: 'Email',
    labelSubject: 'Asunto',
    labelMessage: 'Mensaje enviado',
    ctaLead: 'Mientras tanto, descubre mis lanzamientos y beats más recientes:',
    ctaLabel: 'Explora mi Trabajo',
    followLabel: 'Sígueme',
    footerAuto: 'Este es un mensaje automático para confirmar la recepción de tu solicitud.',
  },
  en: {
    methodNotAllowed: 'Method not allowed',
    requiredFields: 'All fields are required.',
    invalidFields: 'Check the information you entered and try again.',
    processError: 'Error processing the message.',
    serverError: 'Internal server error.',
    subjectLine: (subject) => `I've received your message! - ${subject} - dhreian`,
    preheader: "I got your message and I'll get back to you personally very soon.",
    eyebrow: 'Artist & Music Producer',
    greeting: (name) => `Hi, ${name}:`,
    intro: (subjectLower) =>
      `Thanks for reaching out. I've received your message about <strong style="color:${C.purpleDark};font-weight:600;">${subjectLower}</strong>.`,
    body2:
      "I'm already reviewing your request. I'll get back to you shortly with tailored details and the next steps for your project.",
    summaryTitle: 'Your request summary',
    labelName: 'Name',
    labelEmail: 'Email',
    labelSubject: 'Subject',
    labelMessage: 'Message sent',
    ctaLead: 'In the meantime, discover my latest releases and beats:',
    ctaLabel: 'Explore My Work',
    followLabel: 'Follow me',
    footerAuto: 'This is an automated message confirming we received your request.',
  },
};

function getEmailHtml(c, { name, email, subject, subjectLower, message }) {
  const lang = c === COPY.en ? 'en' : 'es';

  const pStyle = `margin:0;color:${C.inkSoft};line-height:1.65;font-size:17px;font-weight:400;font-family:${FONT_BODY};`;
  const rowLabel = `color:${C.muted};font-size:11px;text-transform:uppercase;letter-spacing:1.4px;font-weight:700;font-family:${FONT_BODY};padding:0 0 3px;`;
  const rowValue = `color:${C.ink};font-size:15px;line-height:1.45;font-family:${FONT_BODY};padding:0 0 16px;word-break:break-word;`;

  const summaryRow = (label, valueHtml) => `
    <tr><td style="${rowLabel}">${label}</td></tr>
    <tr><td style="${rowValue}">${valueHtml}</td></tr>`;

  const socialHtml = SOCIAL.map(
    (s) =>
      `<a href="${s.url}" target="_blank" style="color:${C.purpleDark};font-family:${FONT_BODY};font-size:14px;font-weight:700;letter-spacing:0.3px;text-decoration:none;">${s.label}</a>`
  ).join(`<span style="color:${C.purple};padding:0 8px;">&bull;</span>`);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @font-face{font-family:'Cormorant Infant';font-style:normal;font-weight:300 700;src:url('${SITE_URL}/fonts/cormorant-infant-v22-latin.woff2') format('woff2');}
    :root{color-scheme:light;supported-color-schemes:light;}
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    html,body{margin:0!important;padding:0!important;width:100%!important;background-color:${C.bg}!important;}
    a{text-decoration:none;}
    .email-bg{background:${C.bg}!important;background-color:${C.bg}!important;}
    .email-card{background:${C.card}!important;background-color:${C.card}!important;}
    .email-panel{background:${C.panel}!important;background-color:${C.panel}!important;}
    .email-quote{background:${C.bg}!important;background-color:${C.bg}!important;}
    @media only screen and (max-width:620px){
      .container{width:100%!important;}
      .px{padding-left:24px!important;padding-right:24px!important;}
      .logo{width:76px!important;max-width:76px!important;height:76px!important;}
    }
  </style>
</head>
<body class="email-bg" bgcolor="${C.bg}" style="margin:0;padding:0;background:${C.bg};background-color:${C.bg}!important;font-family:${FONT_BODY};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};opacity:0;">
    ${c.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};background-color:${C.bg}!important;">
    <tr>
      <td class="email-bg" align="center" bgcolor="${C.bg}" style="padding:32px 16px;background:${C.bg};background-color:${C.bg}!important;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" class="container email-card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="width:600px;max-width:600px;background:${C.card};background-color:${C.card}!important;border-radius:18px;border:1px solid ${C.borderSubtle};overflow:hidden;">

          <tr>
            <td height="8" bgcolor="${C.purple}" style="height:8px;line-height:8px;font-size:0;background-color:${C.purple};">&nbsp;</td>
          </tr>

          <tr>
            <td class="px email-card" align="center" bgcolor="${C.card}" style="padding:34px 40px 28px;background:${C.card};background-color:${C.card}!important;border-bottom:1px solid ${C.borderSubtle};">
              <img class="logo" src="${LOGO_URL}" width="76" height="76" alt="dhreian" style="display:block;width:76px;max-width:76px;height:76px;margin:0 auto;border:0;outline:none;text-decoration:none;color:${C.purple};font-family:${FONT_LOGO};font-size:24px;line-height:1;" />
              <div style="color:${C.purpleDeep};font-size:28px;line-height:1;margin-top:14px;font-weight:600;font-family:${FONT_LOGO};">dhreian</div>
              <div style="color:${C.muted};font-size:11px;text-transform:uppercase;letter-spacing:2.4px;margin-top:11px;font-weight:700;font-family:${FONT_BODY};">${c.eyebrow}</div>
            </td>
          </tr>

          <tr>
            <td class="px email-card" bgcolor="${C.card}" style="padding:34px 40px 4px;background:${C.card};background-color:${C.card}!important;">
              <h1 style="font-family:${FONT_BODY};font-size:27px;line-height:1.15;margin:0 0 15px;color:${C.ink};font-weight:600;">${c.greeting(name)}</h1>
              <p style="${pStyle}margin:0 0 15px;">${c.intro(subjectLower)}</p>
              <p style="${pStyle}">${c.body2}</p>
            </td>
          </tr>

          <tr>
            <td class="px email-card" bgcolor="${C.card}" style="padding:28px 40px 0;background:${C.card};background-color:${C.card}!important;">
              <table role="presentation" class="email-panel" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.panel}" style="background:${C.panel};background-color:${C.panel}!important;border-radius:12px;border:1px solid ${C.border};">
                <tr>
                  <td style="padding:22px 24px 10px;">
                    <div style="font-family:${FONT_BODY};font-size:17px;line-height:1.2;margin:0 0 18px;color:${C.ink};font-weight:700;">${c.summaryTitle}</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${summaryRow(c.labelName, name)}
                      ${summaryRow(c.labelEmail, `<a href="mailto:${email}" style="color:${C.purpleDark};text-decoration:none;">${email}</a>`)}
                      ${summaryRow(c.labelSubject, subject)}
                      <tr><td style="${rowLabel}padding-top:4px;">${c.labelMessage}</td></tr>
                      <tr>
                        <td style="padding:6px 0 4px;">
                          <table role="presentation" class="email-quote" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};background-color:${C.bg}!important;border-radius:8px;border-left:3px solid ${C.purple};">
                            <tr><td style="padding:13px 16px;color:${C.inkSoft};font-size:15px;line-height:1.55;font-family:${FONT_BODY};white-space:pre-wrap;">${message}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px email-card" align="center" bgcolor="${C.card}" style="padding:32px 40px 6px;background:${C.card};background-color:${C.card}!important;">
              <p style="${pStyle}text-align:center;margin:0 0 19px;">${c.ctaLead}</p>
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${SITE_URL}" style="height:48px;v-text-anchor:middle;width:236px;" arcsize="14%" strokecolor="${C.purple}" fillcolor="${C.purple}">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:${FONT_BODY};font-size:16px;font-weight:700;letter-spacing:0.5px;">${c.ctaLabel}</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <a href="${SITE_URL}" target="_blank" style="display:inline-block;background-color:${C.purple};color:#ffffff;font-family:${FONT_BODY};font-size:17px;font-weight:700;line-height:20px;text-decoration:none;padding:14px 40px;border-radius:7px;letter-spacing:0.3px;">${c.ctaLabel}</a>
              <!--<![endif]-->
            </td>
          </tr>

          <tr>
            <td class="px email-card" align="center" bgcolor="${C.card}" style="padding:29px 40px 4px;background:${C.card};background-color:${C.card}!important;">
              <div style="color:${C.muted};font-size:11px;text-transform:uppercase;letter-spacing:2.2px;font-weight:700;font-family:${FONT_BODY};margin-bottom:13px;">${c.followLabel}</div>
              <div style="line-height:1.4;">${socialHtml}</div>
            </td>
          </tr>

          <tr>
            <td class="px email-card" align="center" bgcolor="${C.card}" style="padding:24px 40px 34px;background:${C.card};background-color:${C.card}!important;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="1" bgcolor="${C.borderSubtle}" style="height:1px;line-height:1px;font-size:0;background-color:${C.borderSubtle};">&nbsp;</td></tr>
              </table>
              <p style="color:${C.muted};font-size:12px;margin:20px 0 0;font-weight:400;letter-spacing:0.2px;font-family:${FONT_BODY};line-height:1.5;">${c.footerAuto}</p>
              <p style="font-size:14px;margin:14px 0 0;font-family:${FONT_BODY};">
                <a href="${SITE_URL}" target="_blank" style="color:${C.purpleDark};font-weight:700;letter-spacing:0.6px;">dhreian.com</a>
              </p>
            </td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
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

  const { name, email, subject, message } = req.body;
  const visitorName = String(name || '').trim();
  const visitorEmail = String(email || '').trim();
  const emailSubject = normalizeEmailHeader(subject);
  const visitorMessage = String(message || '').trim();

  if (!visitorName || !visitorEmail || !emailSubject || !visitorMessage) {
    return res.status(400).json({ error: c.requiredFields });
  }

  if (
    visitorName.length > 160 ||
    visitorEmail.length > 320 ||
    !EMAIL_PATTERN.test(visitorEmail) ||
    emailSubject.length > 200 ||
    visitorMessage.length > 10000
  ) {
    return res.status(400).json({ error: c.invalidFields });
  }

  try {
    const rateLimit = await applyFormRateLimits(req, {
      route: 'contact',
      email: visitorEmail,
    });

    if (!rateLimit.allowed) {
      res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
      return res.status(429).json({ error: c.processError });
    }
  } catch (error) {
    console.error('Error al aplicar los límites del formulario:', error);
    return res.status(500).json({ error: c.serverError });
  }

  const safe = {
    name: escapeHtml(visitorName),
    email: escapeHtml(visitorEmail),
    subject: escapeHtml(emailSubject),
    subjectLower: escapeHtml(emailSubject.toLowerCase()),
    message: escapeHtml(visitorMessage),
  };

  let submissionId;

  try {
    submissionId = await createContactSubmission({
      name: visitorName,
      email: visitorEmail,
      subject: emailSubject,
      message: visitorMessage,
      language: lang,
    });
  } catch (error) {
    console.error('Error al guardar el mensaje en Neon:', error);
    return res.status(500).json({ error: c.serverError });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      cc: visitorEmail,
      replyTo: visitorEmail,
      subject: c.subjectLine(emailSubject),
      html: getEmailHtml(c, safe),
    });

    if (error) {
      console.error('Error reportado por Resend:', error);
      try {
        await markContactSubmissionFailed(submissionId, error.message || c.processError);
      } catch (databaseError) {
        console.error('Error al actualizar el mensaje fallido en Neon:', databaseError);
      }
      return res.status(400).json({ error: c.processError });
    }

    try {
      await markContactSubmissionSent(submissionId, data?.id);
    } catch (databaseError) {
      console.error('El correo se envió, pero no se actualizó su estado en Neon:', databaseError);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error interno al enviar con Resend:', error);
    try {
      await markContactSubmissionFailed(submissionId, error.message || c.serverError);
    } catch (databaseError) {
      console.error('Error al actualizar el mensaje fallido en Neon:', databaseError);
    }
    return res.status(500).json({ error: c.serverError });
  }
}
