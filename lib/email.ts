import nodemailer from "nodemailer";

export const SITE_URL = "https://themnhwonderrides.com";
const LOGO_URL = `${SITE_URL}/favicon.jpg`;

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function emailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#fff5f9;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f9;padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="background:#fda4cf;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding-right:12px;vertical-align:middle;">
                      <img src="${LOGO_URL}" alt="MNH Logo" width="52" height="52"
                        style="border-radius:50%;border:3px solid rgba(255,255,255,0.8);display:block;" />
                    </td>
                    <td style="vertical-align:middle;text-align:left;">
                      <div style="color:#831843;font-size:18px;font-weight:800;line-height:1.2;">The MNH Wonder Rides</div>
                      <div style="color:#be185d;font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;margin-top:3px;opacity:0.8;">Electric Animal Rides · Long Island, NY</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content card -->
            <tr>
              <td style="background:#fff;border:1px solid #fce7f3;border-top:none;border-radius:0 0 16px 16px;padding:28px 32px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 0;text-align:center;">
                <div style="margin-bottom:10px;">
                  <a href="${SITE_URL}" style="color:#f9a8d4;text-decoration:none;font-size:11.5px;margin:0 8px;">Home</a>
                  <a href="${SITE_URL}/party" style="color:#f9a8d4;text-decoration:none;font-size:11.5px;margin:0 8px;">Party Packages</a>
                  <a href="${SITE_URL}/waiver" style="color:#f9a8d4;text-decoration:none;font-size:11.5px;margin:0 8px;">Waiver</a>
                  <a href="${SITE_URL}/contact" style="color:#f9a8d4;text-decoration:none;font-size:11.5px;margin:0 8px;">Contact</a>
                </div>
                <div style="font-size:10.5px;color:#d1aabb;">© ${new Date().getFullYear()} The MNH Wonder Rides · Long Island, NY</div>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}
