export function notFoundHandler(req, res) {
  res.status(404).json({ ok: false, error: "not_found", path: req.path });
}
