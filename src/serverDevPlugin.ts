import type { Plugin } from "vite";
import sendOtpHandler from "../api/auth/send-otp";
import verifyOtpHandler from "../api/auth/verify-otp";
import studentRecordsHandler from "../api/student/records";
import verifyCertificateHandler from "../api/certificates/verify";
import adminSendOtpHandler from "../api/auth/admin-send-otp";
import adminVerifyOtpHandler from "../api/auth/admin-verify-otp";
import adminVerifySessionHandler from "../api/auth/admin-verify-session";

export function devApiPlugin(): Plugin {
  return {
    name: "clickudaan-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url || "", "http://localhost");
        const url = parsedUrl.pathname;

        let handler: any = null;
        if (url === "/api/auth/send-otp") handler = sendOtpHandler;
        else if (url === "/api/auth/verify-otp") handler = verifyOtpHandler;
        else if (url === "/api/student/records") handler = studentRecordsHandler;
        else if (url === "/api/certificates/verify") handler = verifyCertificateHandler;
        else if (url === "/api/auth/admin-send-otp") handler = adminSendOtpHandler;
        else if (url === "/api/auth/admin-verify-otp") handler = adminVerifyOtpHandler;
        else if (url === "/api/auth/admin-verify-session") handler = adminVerifySessionHandler;

        if (!handler) {
          return next();
        }

        // Attach res.status and res.json helpers matching Serverless Function signature
        const enhancedRes = res as any;
        enhancedRes.status = (statusCode: number) => {
          enhancedRes.statusCode = statusCode;
          return enhancedRes;
        };
        enhancedRes.json = (data: any) => {
          enhancedRes.setHeader("Content-Type", "application/json");
          enhancedRes.end(JSON.stringify(data));
          return enhancedRes;
        };

        const enhancedReq = req as any;
        enhancedReq.query = Object.fromEntries(parsedUrl.searchParams.entries());
        if (req.method === "GET") {
          try {
            await handler(enhancedReq, enhancedRes);
          } catch (err: any) {
            console.error("API GET handler error:", err);
            enhancedRes.status(500).json({ error: err.message || "Internal server error" });
          }
          return;
        }

        // For POST / PUT
        let bodyStr = "";
        req.on("data", (chunk) => {
          bodyStr += chunk;
        });

        req.on("end", async () => {
          try {
            enhancedReq.body = bodyStr ? JSON.parse(bodyStr) : {};
          } catch {
            enhancedReq.body = bodyStr;
          }

          try {
            await handler(enhancedReq, enhancedRes);
          } catch (err: any) {
            console.error("API POST handler error:", err);
            enhancedRes.status(500).json({ error: err.message || "Internal server error" });
          }
        });
      });
    },
  };
}
