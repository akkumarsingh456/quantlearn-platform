import express, { type Express, type RequestHandler } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";
import cors from "cors";
import pinoHttpModule from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();
type PinoHttpFactory = (options: unknown) => RequestHandler;
const pinoHttpInterop = pinoHttpModule as unknown as
  | PinoHttpFactory
  | { default?: PinoHttpFactory };
const pinoHttp: PinoHttpFactory =
  typeof pinoHttpInterop === "function"
    ? pinoHttpInterop
    : pinoHttpInterop.default ?? (() => {
        throw new Error("pino-http factory export is unavailable");
      });

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

app.use((error: unknown, req: IncomingMessage, res: ServerResponse, _next: unknown) => {
  if (res.headersSent) return;
  const message = error instanceof Error ? error.message : "Unexpected API error.";
  logger.error({ err: error, method: req.method, url: req.url?.split("?")[0] }, "API request failed");
  const isConfigurationError = message.includes("Missing Clerk Secret Key") || message.includes("Missing Clerk Publishable Key");
  res.statusCode = isConfigurationError ? 503 : 500;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: message }));
});

export default app;
