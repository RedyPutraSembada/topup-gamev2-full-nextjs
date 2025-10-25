// import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { findIp } from "@arcjet/ip";
import { auth } from "@/utils/auth";
import arcjet, { detectBot, protectSignup, shield, slidingWindow } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_API_KEY,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
});

// ==== ARCJET SETTINGS ====

const botSettings = {
  mode: "LIVE",
  allow: ["STRIPE_WEBHOOK"],
};

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
};

const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
};

const emailSettings = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
};

// ==== AUTH HANDLERS ====

const authHandlers = toNextJsHandler(auth);
export const { GET } = authHandlers;

// ==== MAIN POST HANDLER ====

export async function POST(request) {
  const clonedRequest = request.clone();
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message = "Invalid email.";

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid.";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid.";
      }

      return new Response(JSON.stringify({ message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(null, { status: 403 });
    }
  }

  return authHandlers.POST(clonedRequest);
}

// ==== ARCJET CHECK ====

async function checkArcjet(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const session = await auth.api.getSession({ headers: request.headers });
  const userIdOrIp = (session?.user?.id ?? findIp(request)) || "127.0.0.1";

  if (request.url.endsWith("/auth/sign-up")) {
    if (body && typeof body === "object" && body.email && typeof body.email === "string") {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(request, { email: body.email, userIdOrIp });
    } else {
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp });
    }
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp });
}
