import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY || "";
const SITE_URL = "https://themnhwonderrides.com";
const LOGO_URL = `${SITE_URL}/favicon.jpg`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function verifyHCaptcha(token: string) {
  try {
    const response = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${token}&secret=${HCAPTCHA_SECRET}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
}

function emailWrapper(content: string) {
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

function customerReceiptHtml(firstName: string, subjectLine: string, message: string) {
  const safeName = escapeHtml(firstName);
  const safeSubject = escapeHtml(subjectLine);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  return emailWrapper(`
    <h2 style="font-size:18px;color:#831843;font-weight:700;margin:0 0 8px;">Hi ${safeName}! 🦄</h2>
    <p style="font-size:13.5px;color:#6b7280;line-height:1.7;margin:0 0 20px;">
      Thank you so much for reaching out! We've received your message and
      can't wait to help make your little one's day extra magical.
      Our team will get back to you within <strong style="color:#be185d;">1–2 business days</strong>.
    </p>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">📋 Your Submission</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;">
      <tr>
        <td style="color:#d1aabb;width:120px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Subject</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;"><strong>${safeSubject}</strong></td>
      </tr>
    </table>
    <div style="background:#fff5f9;border:1.5px solid #fce7f3;border-radius:10px;padding:14px 16px;font-size:13px;color:#4b5563;line-height:1.7;margin-top:8px;">
      ${safeMessage}
    </div>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">📍 Find Us</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;">
      <tr>
        <td style="color:#d1aabb;width:120px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Phone</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;">(516) 423-6988</td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:120px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Email</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;">hello@themnhwonderrides.com</td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:120px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Locations</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;line-height:1.6;">
          Samanea New York, Westbury NY<br/>Broadway Commons, Hicksville NY
        </td>
      </tr>
    </table>

    <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:11px 14px;font-size:12px;color:#c2410c;margin-top:20px;line-height:1.6;">
      🎂 Planning a party? We recommend booking at least <strong>2 weeks in advance</strong> to secure your preferred date!
    </div>
  `);
}

function adminNotificationHtml(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  childAge: string,
  preferredContact: string,
  subjectLine: string,
  message: string
) {
  const safeName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "N/A");
  const safeChildAge = escapeHtml(childAge || "N/A");
  const safePreferredContact = escapeHtml(preferredContact || "N/A");
  const safeSubject = escapeHtml(subjectLine);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  return emailWrapper(`
    <h2 style="font-size:18px;color:#831843;font-weight:700;margin:0 0 8px;">
      New Message Received
      <span style="display:inline-block;background:#fef9c3;color:#a16207;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;border:1px solid #fde68a;margin-left:8px;vertical-align:middle;">New</span>
    </h2>
    <p style="font-size:13.5px;color:#6b7280;line-height:1.7;margin:0 0 20px;">
      Someone just submitted the contact form on your website.
      Here are their details — reply to follow up!
    </p>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">👤 Customer Details</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;">
      <tr>
        <td style="color:#d1aabb;width:130px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Name</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;"><strong>${safeName} ${safeLastName}</strong></td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:130px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Email</td>
        <td style="padding:5px 0;vertical-align:top;"><a href="mailto:${safeEmail}" style="color:#ec4899;text-decoration:none;">${safeEmail}</a></td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:130px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Phone</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;">${safePhone}</td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:130px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Child Age</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;">${safeChildAge}</td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:130px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Preferred Contact</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;">${safePreferredContact}</td>
      </tr>
      <tr>
        <td style="color:#d1aabb;width:130px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Subject</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;"><strong>${safeSubject}</strong></td>
      </tr>
    </table>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">💬 Message</div>
    <div style="background:#fff5f9;border:1.5px solid #fce7f3;border-radius:10px;padding:14px 16px;font-size:13px;color:#4b5563;line-height:1.7;">
      ${safeMessage}
    </div>

    <div style="margin-top:20px;">
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#ec4899;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:11px 26px;border-radius:999px;">
        Reply to ${safeName} →
      </a>
    </div>

    <p style="font-size:11px;color:#d1aabb;margin-top:20px;">
      This notification was sent automatically from the MNH Wonder Rides website.
    </p>
  `);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      childAge,
      preferredContact,
      message,
      subject,
      captchaToken,
    } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { error: "Missing captcha token" },
        { status: 400 }
      );
    }

    const isHuman = await verifyHCaptcha(captchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    const subjectLine = subject || "General Inquiry";

    // 1. Save to Database
    await db.sql`
      INSERT INTO messages (first_name, last_name, email, phone, child_age, preferred_contact, subject, message, status)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${childAge}, ${preferredContact}, ${subjectLine}, ${message}, 'unread')
    `;

    // 2. Send Emails via SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAIL) {
      try {
        await Promise.all([
          transporter.sendMail({
            from: `"MNH Wonder Rides" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Inquiry: ${subjectLine}`,
            html: adminNotificationHtml(firstName, lastName, email, phone, childAge, preferredContact, subjectLine, message),
          }),
          transporter.sendMail({
            from: `"MNH Wonder Rides" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "We received your message — MNH Wonder Rides",
            html: customerReceiptHtml(firstName, subjectLine, message),
          }),
        ]);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
