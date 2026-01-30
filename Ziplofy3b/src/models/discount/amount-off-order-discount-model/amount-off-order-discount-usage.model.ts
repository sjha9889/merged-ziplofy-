import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAmountOffOrderDiscountUsage {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  discountId: mongoose.Types.ObjectId; // AmountOffOrderDiscount
  customerId: mongoose.Types.ObjectId; // Customer who used the discount
  orderId?: mongoose.Types.ObjectId; // Optional: reference to the order where discount was used
  discountAmount: number; // Amount of discount applied
  createdAt: Date;
  updatedAt: Date;
}

const amountOffOrderDiscountUsageSchema = new Schema<IAmountOffOrderDiscountUsage & Document>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  discountId: { type: Schema.Types.ObjectId, ref: 'AmountOffOrderDiscount', required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', default: null, index: true },
  discountAmount: { type: Number, required: true, min: 0 },
}, { timestamps: true, versionKey: false });

// Compound indexes for efficient queries
amountOffOrderDiscountUsageSchema.index({ storeId: 1, discountId: 1 });
amountOffOrderDiscountUsageSchema.index({ storeId: 1, customerId: 1 });
amountOffOrderDiscountUsageSchema.index({ discountId: 1, customerId: 1 });
amountOffOrderDiscountUsageSchema.index({ storeId: 1, discountId: 1, customerId: 1 });

export const AmountOffOrderDiscountUsage: Model<IAmountOffOrderDiscountUsage & Document> =
  mongoose.models.AmountOffOrderDiscountUsage || mongoose.model<IAmountOffOrderDiscountUsage & Document>('AmountOffOrderDiscountUsage', amountOffOrderDiscountUsageSchema);
