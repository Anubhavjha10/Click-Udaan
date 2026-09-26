import { verifyOTP } from "../_lib/otpStore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
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
      return res.status(400).json({ error: "Email and OTP are both required." });
    }

    const verification = verifyOTP(email, otp);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: verification.error || "Invalid or expired OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      token: verification.token,
      email: email.trim().toLowerCase(),
      message: "OTP verified successfully. Access granted to Student Portal.",
    });
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ error: "Internal server error while verifying OTP." });
  }
}
