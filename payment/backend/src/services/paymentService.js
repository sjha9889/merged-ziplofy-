import { Payment } from "../models/Payment.js";

/**
 * @param {object} data
 * @returns {Promise<{ id: string, referenceId: string }>}
 */
export async function createPaymentRecord(data) {
  try {
    const doc = await Payment.create({
      name: data.name,
      email: data.email,
      utr: data.utr,
      referenceId: data.referenceId,
      amountPaise: data.amountPaise ?? null,
      merchantName: data.merchantName ?? null,
      orderId: data.orderId ?? null,
    });
    return {
      id: doc._id.toString(),
      referenceId: doc.referenceId,
    };
  } catch (e) {
    if (e && e.code === 11000) {
      const err = new Error("duplicate_utr");
      err.code = "DUPLICATE_UTR";
      throw err;
    }
    throw e;
  }
}
