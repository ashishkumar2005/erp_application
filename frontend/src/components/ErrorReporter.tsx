"use client";

import { useEffect, useRef } from "react";

type ReporterProps = {
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function ErrorReporter({ error }: ReporterProps) {
  const lastOverlayMsg = useRef<string>("");
  const pollRef = useRef<number | null>(null);

  /* ───────── Shared error instrumentation ───────── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const inIframe = window.parent !== window;
    if (!inIframe) return;

    const send = (payload: unknown) =>
      window.parent.postMessage(payload, "*");

    const onError = (e: ErrorEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.message,
          stack: e.error?.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          source: "window.onerror",
        },
        timestamp: Date.now(),
      });

    const onReject = (e: PromiseRejectionEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.reason?.message ?? String(e.reason),
          stack: e.reason?.stack,
          source: "unhandledrejection",
        },
        timestamp: Date.now(),
      });

    const pollOverlay = () => {
      const overlay = document.querySelector(
        "[data-nextjs-dialog-overlay]"
      );
      const node =
        overlay?.querySelector(
          "h1, h2, .error-message, [data-nextjs-dialog-body]"
        ) ?? null;

      const txt = node?.textContent ?? "";
      if (txt && txt !== lastOverlayMsg.current) {
        lastOverlayMsg.current = txt;
        send({
          type: "ERROR_CAPTURED",
          error: { message: txt, source: "nextjs-dev-overlay" },
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    pollRef.current = window.setInterval(pollOverlay, 1000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  /* ───────── Global error page reporting ───────── */
  useEffect(() => {
    if (!error || typeof window === "undefined") return;

    window.parent?.postMessage(
      {
        type: "global-error",
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          name: error.name,
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      },
      "*"
    );
  }, [error]);

  /* ───────── Normal pages render nothing ───────── */
  if (!error) return null;

  /* ───────── Global error UI ───────── */
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-destructive">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left text-sm bg-muted p-3 rounded">
              <summary className="cursor-pointer font-medium">
                Error details
              </summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}