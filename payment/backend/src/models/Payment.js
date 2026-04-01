import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    utr: { type: String, required: true, trim: true, unique: true },
    referenceId: { type: String, required: true, trim: true },
    amountPaise: { type: Number, default: null },
    merchantName: { type: String, default: null, trim: true },
    orderId: { type: String, default: null, trim: true },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
