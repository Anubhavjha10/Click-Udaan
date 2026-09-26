import * as fs from "fs";
import * as path from "path";
import nodemailer from "nodemailer";

function ensureEnvLoaded() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      }
    }
  } catch {}
}

export async function sendOtpEmail(toEmail: string, otp: string): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  ensureEnvLoaded();

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "clickudaan@gmail.com";
  let pass = process.env.SMTP_PASSWORD;
  if (pass) {
    // Strip accidental spaces and quotes from password
    pass = pass.replace(/\s+/g, "");
    if ((pass.startsWith('"') && pass.endsWith('"')) || (pass.startsWith("'") && pass.endsWith("'"))) {
      pass = pass.slice(1, -1);
    }
  }
  const fromEmail = process.env.SMTP_FROM_EMAIL || "clickudaan@gmail.com";
  const fromName = process.env.SMTP_FROM_NAME || "ClickUdaan";

  // Safe SMTP Diagnostics (no secrets logged)
  console.log(`[SMTP_DIAGNOSTIC] SMTP_HOST configured: ${host ? "YES (" + host + ")" : "NO"}`);
  console.log(`[SMTP_DIAGNOSTIC] SMTP_PORT configured: ${port ? "YES (" + port + ")" : "NO"}`);
  console.log(`[SMTP_DIAGNOSTIC] SMTP_USER configured: ${user ? "YES (" + user + ")" : "NO"}`);
  console.log(`[SMTP_DIAGNOSTIC] SMTP_PASSWORD configured: ${pass && pass.length > 0 ? "YES" : "NO"}`);
  console.log(`[SMTP_DIAGNOSTIC] SMTP_FROM_EMAIL configured: ${fromEmail ? "YES (" + fromEmail + ")" : "NO"}`);

  // Verify SMTP password exists without logging any secret
  if (!pass || pass.trim() === "" || pass === "YOUR_GMAIL_APP_PASSWORD") {
    console.error("[MAILER] SMTP_PASSWORD is not configured in environment. Email OTP cannot be sent.");
    return { success: false, error: "SMTP service is not configured (missing SMTP_PASSWORD)" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify SMTP connection before sending
    await transporter.verify();

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
        <div style="background: linear-gradient(135deg, #0e4da4 0%, #093c85 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Click<span style="color: #f4c21d;">उड़ान</span></h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 14px;">Where Clicks Take Flight • Student Portal</p>
        </div>
        
        <div style="padding: 32px 28px;">
          <h2 style="color: #0e4da4; font-size: 20px; margin-top: 0; margin-bottom: 12px;">Student Verification OTP</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Hello, we received a request to access your ClickUdaan Student Portal. Use the One-Time Password (OTP) below to complete your verification:
          </p>
          
          <div style="background-color: #f8fafc; border: 2px dashed #0e4da4; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0e4da4; font-family: monospace;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">
            ⏳ <strong>Notice:</strong> This OTP is valid for <strong>10 minutes</strong> and can only be used once.
          </p>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
            If you did not request this verification, please safely ignore this email. Do not share this OTP with anyone.
          </p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © 2026 ClickUdaan (Vabit Digify Media Pvt Ltd). All rights reserved.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: `Your ClickUdaan Student Portal Verification OTP: ${otp}`,
      html,
      text: `Your ClickUdaan verification OTP is ${otp}. Valid for 10 minutes. If you did not request this, please ignore.`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[MAILER_ERROR] Nodemailer error occurred:");
    console.error(`- error.code: ${err.code || "N/A"}`);
    console.error(`- error.command: ${err.command || "N/A"}`);
    console.error(`- error.responseCode: ${err.responseCode || "N/A"}`);
    console.error(`- error.response: ${err.response || "N/A"}`);
    console.error(`- error.message: ${err.message || err}`);
    return { success: false, error: err.message || "Failed to send email via SMTP" };
  }
}
