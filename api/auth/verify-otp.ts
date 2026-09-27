import { verifyOTP } from "../_lib/otpStore";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  let currentStage = "request_validation";

  try {
    console.log("[STUDENT_OTP] request received: POST /api/auth/verify-otp");

    let body: any = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { email, otp } = body || {};

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are both required." });
    }

    currentStage = "otp_verification";
    const verification = await verifyOTP(email, otp);

    if (!verification.success) {
      console.warn(`[STUDENT_OTP] verification failed: ${verification.error}`);
      return res.status(400).json({
        success: false,
        error: verification.error || "Invalid or expired OTP.",
      });
    }

    console.log("[STUDENT_OTP] OTP verified successfully");

    return res.status(200).json({
      success: true,
      token: verification.token,
      email: email.trim().toLowerCase(),
      message: "OTP verified successfully. Access granted to Student Portal.",
    });
  } catch (err: any) {
    console.error(
      `[STUDENT_OTP_ERROR]\nstage=${currentStage}\nname=${err?.name || "UnhandledError"}\nmessage=${err?.message || String(err)}\ncode=${err?.code || "INTERNAL_SERVER_ERROR"}\nresponseCode=500\ncommand=handler`
    );
    return res.status(500).json({ success: false, error: "Internal server error while verifying OTP." });
  }
}
