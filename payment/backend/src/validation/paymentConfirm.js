const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTR_RE = /^\d{10,18}$/;

export function validateConfirmBody(body) {
  const errors = {};
  const b = body && typeof body === "object" ? body : {};

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (name.length < 2) errors.name = "Name must be at least 2 characters";

  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!EMAIL_RE.test(email)) errors.email = "Invalid email address";

  const utrRaw = typeof b.utr === "string" ? b.utr.replace(/\D/g, "") : "";
  if (!UTR_RE.test(utrRaw)) errors.utr = "UTR must be 10–18 digits";

  const referenceId = typeof b.referenceId === "string" ? b.referenceId.trim() : "";
  if (!referenceId) errors.referenceId = "Missing payment reference";

  const amountPaise =
    typeof b.amountPaise === "number" && Number.isFinite(b.amountPaise)
      ? Math.round(b.amountPaise)
      : null;

  const merchantName =
    typeof b.merchantName === "string" ? b.merchantName.trim() : null;

  const orderId = typeof b.orderId === "string" ? b.orderId.trim() : null;

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      name,
      email,
      utr: utrRaw,
      referenceId,
      amountPaise,
      merchantName: merchantName || null,
      orderId: orderId || null,
    },
  };
}
