export function errorHandler(err, _req, res, _next) {
  console.error("[api]", err);
  if (res.headersSent) return;
  res.status(500).json({ ok: false, error: "server_error" });
}
