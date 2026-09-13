import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { db } from "@/lib/db";
import { escapeHtml, emailWrapper, transporter, SITE_URL } from "@/lib/email";
import {
  bookingFormSchema,
  partyMinutes,
  PIZZA_OPTION,
  DEPOSIT_AMOUNT,
  type BookingFormValues,
} from "@/app/(public)/party/book/bookingForm";

dayjs.extend(utc);
dayjs.extend(timezone);

// Parties are scheduled in local (New York) time regardless of where the
// customer's device thinks it is.
const TIMEZONE = "America/New_York";
const MIN_SUBMIT_TIME_MS = 3000; // Minimum 3 seconds to fill form

function detailRows(rows: [string, string][]) {
  return rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="color:#d1aabb;width:150px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="color:#374151;padding:5px 0;vertical-align:top;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
      </tr>`
    )
    .join("");
}

function summaryRows(data: BookingFormValues, start: dayjs.Dayjs, end: dayjs.Dayjs): [string, string][] {
  const wantsPizza = data.foodOptions.includes(PIZZA_OPTION);
  return [
    ["Date", start.format("dddd, MMMM D, YYYY")],
    ["Time", `${start.format("h:mm A")} – ${end.format("h:mm A")}`],
    ["Package", data.packageType],
    ["Children", data.childCount],
    ["Age", data.childAge],
    ["Add-Ons", data.addOns.length ? data.addOns.join(", ") : "None"],
    ["Food", data.foodOptions.join(", ")],
    ...(wantsPizza
      ? ([
          ["Pizza", `${data.pizzaCount || "?"} × ${data.pizzaPreference || "?"} (large)`],
        ] as [string, string][])
      : []),
    ["Photo Permission", data.photoPermission === "yes" ? "Yes" : "No"],
    ["Special Requests", data.specialRequests || "None"],
  ];
}

function customerReceiptHtml(data: BookingFormValues, rows: [string, string][]) {
  return emailWrapper(`
    <h2 style="font-size:18px;color:#831843;font-weight:700;margin:0 0 8px;">Hi ${escapeHtml(data.parentName)}! 🎉</h2>
    <p style="font-size:13.5px;color:#6b7280;line-height:1.7;margin:0 0 20px;">
      We received your party booking request! Here's what you sent us — our team
      will reach out shortly to confirm the details.
    </p>

    <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:14px 16px;font-size:13px;color:#c2410c;line-height:1.7;">
      <strong>Your booking is not confirmed yet.</strong> A $${DEPOSIT_AMOUNT} deposit is
      required to secure your time slot — time slots are not held without a deposit.<br/>
      <strong>Zelle:</strong> 516-373-1319 &nbsp;·&nbsp; <strong>Venmo:</strong> @themnhwonderrides<br/>
      The remaining balance is due before the party begins on the day of the event.
    </div>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">🎂 Your Party</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;">
      ${detailRows(rows)}
    </table>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <p style="font-size:13.5px;color:#6b7280;line-height:1.7;margin:0 0 14px;">
      Please make sure <strong>all attending parents</strong> sign the waiver before the event:
    </p>
    <div style="text-align:center;">
      <a href="${SITE_URL}/waiver" style="display:inline-block;background:#ec4899;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:11px 26px;border-radius:999px;">
        ✍️ Sign the Waiver
      </a>
    </div>

    <p style="font-size:12px;color:#d1aabb;margin-top:20px;line-height:1.6;">
      Questions? Call us at (516) 373-1319.
    </p>
  `);
}

function adminNotificationHtml(data: BookingFormValues, rows: [string, string][]) {
  const safeEmail = escapeHtml(data.email);
  return emailWrapper(`
    <h2 style="font-size:18px;color:#831843;font-weight:700;margin:0 0 8px;">
      New Party Booking Request
      <span style="display:inline-block;background:#fef9c3;color:#a16207;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;border:1px solid #fde68a;margin-left:8px;vertical-align:middle;">Pending deposit</span>
    </h2>
    <p style="font-size:13.5px;color:#6b7280;line-height:1.7;margin:0 0 20px;">
      Waiting in <strong>Booking Requests</strong>. It does not hold the slot until you confirm it — do that once the $${DEPOSIT_AMOUNT} deposit arrives.
    </p>

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">👤 Customer</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;">
      ${detailRows([
        ["Parent Name", data.parentName],
        ["Phone", data.phone],
      ])}
      <tr>
        <td style="color:#d1aabb;width:150px;font-size:12px;padding:5px 12px 5px 0;vertical-align:top;">Email</td>
        <td style="padding:5px 0;vertical-align:top;"><a href="mailto:${safeEmail}" style="color:#ec4899;text-decoration:none;">${safeEmail}</a></td>
      </tr>
    </table>

    <hr style="border:none;border-top:1.5px dashed #fce7f3;margin:18px 0;" />

    <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f472b6;margin-bottom:10px;">🎂 Party Details</div>
    <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;">
      ${detailRows(rows)}
    </table>

    <div style="margin-top:20px;">
      <a href="${SITE_URL}/admin/requests" style="display:inline-block;background:#ec4899;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:11px 26px;border-radius:999px;">
        Review Booking Request →
      </a>
    </div>
  `);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot / speed checks — silently accept so bots learn nothing.
    if (body._hp) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
    if (body._ts && Date.now() - body._ts < MIN_SUBMIT_TIME_MS) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = bookingFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Ignore pizza answers left behind if the guest unticked the pizza option.
    const wantsPizza = data.foodOptions.includes(PIZZA_OPTION);
    const pizzaPreference = wantsPizza ? data.pizzaPreference || null : null;
    const pizzaCount = wantsPizza && data.pizzaCount ? Number(data.pizzaCount) : null;

    const start = dayjs.tz(`${data.partyDate} ${data.startTime}`, TIMEZONE);
    const end = start.add(partyMinutes(data.packageType, data.addOns), "minute");

    if (!start.isValid() || start.isBefore(dayjs())) {
      return NextResponse.json(
        { error: "Please choose a date and time in the future." },
        { status: 400 }
      );
    }

    // Pending until the deposit lands, so overlapping requests are allowed
    // through — staff resolve conflicts when confirming.
    await db.sql`
      INSERT INTO bookings (
        start_time, end_time, customer_name, customer_phone, customer_email,
        child_age, child_count, package_type, add_ons, food_options,
        pizza_preference, pizza_count, special_requests, photo_permission,
        terms_accepted, waiver_acknowledged, deposit_amount, status, source
      ) VALUES (
        ${start.toISOString()}, ${end.toISOString()},
        ${data.parentName}, ${data.phone}, ${data.email},
        ${data.childAge}, ${Number(data.childCount)}, ${data.packageType},
        ${JSON.stringify(data.addOns)}, ${JSON.stringify(data.foodOptions)},
        ${pizzaPreference}, ${pizzaCount},
        ${data.specialRequests || null}, ${data.photoPermission === "yes"},
        ${data.agreementAccepted}, ${data.waiverAcknowledged}, 0, 'pending', 'website'
      )
    `;

    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAIL) {
      const rows = summaryRows(data, start, end);
      try {
        await Promise.all([
          transporter.sendMail({
            from: `"MNH Wonder Rides" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            cc: process.env.ADMIN_EMAIL,
            replyTo: data.email,
            subject: `New Party Booking: ${data.parentName} — ${start.format("MMM D, h:mm A")}`,
            html: adminNotificationHtml(data, rows),
          }),
          transporter.sendMail({
            from: `"MNH Wonder Rides" <${process.env.SMTP_USER}>`,
            to: data.email,
            subject: "We received your party booking request — MNH Wonder Rides",
            html: customerReceiptHtml(data, rows),
          }),
        ]);
      } catch (emailError) {
        console.error("Failed to send booking email:", emailError);
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting party booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
