import { Router } from "express";
import { createPaymentRecord } from "../services/paymentService.js";
import { validateConfirmBody } from "../validation/paymentConfirm.js";

export function createPaymentsRouter() {
  const router = Router();

  router.post("/confirm", async (req, res, next) => {
    try {
      const parsed = validateConfirmBody(req.body);
      if (!parsed.ok) {
        return res.status(400).json({
          ok: false,
          error: "validation_failed",
          details: parsed.errors,
        });
      }

      const v = parsed.values;
      const record = await createPaymentRecord({
        name: v.name,
        email: v.email,
        utr: v.utr,
        referenceId: v.referenceId,
        amountPaise: v.amountPaise,
        merchantName: v.merchantName,
        orderId: v.orderId,
      });

      return res.status(201).json({
        ok: true,
        id: record.id,
        referenceId: record.referenceId,
      });
    } catch (e) {
      if (e && e.code === "DUPLICATE_UTR") {
        return res.status(409).json({
          ok: false,
          error: "duplicate_utr",
          message:
            "This UTR was already submitted. Contact support if this is a mistake.",
        });
      }
      next(e);
    }
  });

  return router;
}
