import nodemailer from "nodemailer";

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      // Fallback: Ethereal test inbox for local development
      try {
        const test = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
          host: test.smtp.host,
          port: test.smtp.port,
          secure: test.smtp.secure,
          auth: {
            user: test.user,
            pass: test.pass,
          },
        });
      } catch (e) {
        return null;
      }
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  })();

  return transporterPromise;
}

export async function sendEmail({ to, subject, html, attachments = [] }) {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.log("[email disabled]", { to, subject });
      return { ok: false, disabled: true };
    }

    const from =
      process.env.MAIL_FROM ||
      process.env.SMTP_USER ||
      "no-reply@sportssphere.local";

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log("[email preview]", previewUrl);
    return { ok: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error("Email send error:", err);
    return { ok: false, error: err.message };
  }
}

