import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY || "";
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 1. Save to Database
    await db.sql`
      INSERT INTO messages (first_name, last_name, email, phone, child_age, preferred_contact, subject, message, status)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${childAge}, ${preferredContact}, ${
      subject || "General Inquiry"
    }, ${message}, 'unread')
    `;

    // 2. Send Email Notification via Resend
    // Only attempt if API Key is configured to avoid errors in dev/test
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: "MNH Notifications <onboarding@themnhwonderrides.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Inquiry: ${subject || "General Inquiry"}`,
          html: `
            <h2>New Message from MNH Wonder Rides Website</h2>
            <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
            <p><strong>Phone:</strong> ${phone || "N/A"}</p>
            <p><strong>Child Age:</strong> ${childAge || "N/A"}</p>
            <p><strong>Preferred Contact:</strong> ${
              preferredContact || "N/A"
            }</p>
            <hr />
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr />
            <p><small>This email was sent automatically from your website contact form.</small></p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // We don't block the response here, just log the error
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
