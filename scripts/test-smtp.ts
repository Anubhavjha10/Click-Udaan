import * as fs from "fs";
import * as path from "path";
import nodemailer from "nodemailer";

function loadEnvFile() {
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
}

loadEnvFile();

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = parseInt(process.env.SMTP_PORT || "587", 10);
const user = process.env.SMTP_USER || "clickudaan@gmail.com";
let pass = process.env.SMTP_PASSWORD;
if (pass) {
  // Strip whitespace in case of app password grouping spaces
  pass = pass.replace(/\s+/g, "");
}
const fromEmail = process.env.SMTP_FROM_EMAIL || "clickudaan@gmail.com";
const fromName = process.env.SMTP_FROM_NAME || "ClickUdaan";

console.log("========================================");
console.log("ClickUdaan SMTP Diagnostic Test");
console.log("========================================");

console.log(`SMTP_HOST configured: ${host ? "YES (" + host + ")" : "NO"}`);
console.log(`SMTP_PORT configured: ${port ? "YES (" + port + ")" : "NO"}`);
console.log(`SMTP_USER configured: ${user ? "YES (" + user + ")" : "NO"}`);
console.log(`SMTP_PASSWORD configured: ${pass && pass.length > 0 ? "YES" : "NO"}`);
console.log(`SMTP_FROM_EMAIL configured: ${fromEmail ? "YES (" + fromEmail + ")" : "NO"}`);

if (!pass) {
  console.error("\n[ERROR] SMTP_PASSWORD is not set in environment.");
  process.exit(1);
}

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

async function runTest() {
  console.log("\nVerifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("SMTP VERIFY: PASS");
  } catch (err: any) {
    console.error("SMTP VERIFY: FAIL");
    console.error(`Error Code: ${err.code || "N/A"}`);
    console.error(`Command: ${err.command || "N/A"}`);
    console.error(`Response Code: ${err.responseCode || "N/A"}`);
    console.error(`Response: ${err.response || "N/A"}`);
    console.error(`Message: ${err.message || err}`);
    process.exit(1);
  }

  console.log("\nSending test email to " + user + "...");
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: user,
      subject: "ClickUdaan SMTP Test",
      text: "SMTP configuration is working.",
      html: "<p>SMTP configuration is working.</p>",
    });
    console.log("TEST EMAIL: SENT");
    console.log(`Message ID: ${info.messageId}`);
    console.log("\n========================================");
    console.log("SMTP DIAGNOSTIC COMPLETE: SUCCESS");
    console.log("========================================");
  } catch (err: any) {
    console.error("TEST EMAIL: FAILED");
    console.error(`Error Code: ${err.code || "N/A"}`);
    console.error(`Response Code: ${err.responseCode || "N/A"}`);
    console.error(`Response: ${err.response || "N/A"}`);
    console.error(`Message: ${err.message || err}`);
    process.exit(1);
  }
}

runTest();
