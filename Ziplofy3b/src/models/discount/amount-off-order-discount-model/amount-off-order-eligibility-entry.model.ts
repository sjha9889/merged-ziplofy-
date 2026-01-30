import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAmountOffOrderEligibilityEntry {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  discountId: mongoose.Types.ObjectId; // AmountOffOrderDiscount
  customerSegmentId?: mongoose.Types.ObjectId | null;
  customerId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const amountOffOrderEligibilityEntrySchema = new Schema<IAmountOffOrderEligibilityEntry & Document>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  discountId: { type: Schema.Types.ObjectId, ref: 'AmountOffOrderDiscount', required: true, index: true },
  customerSegmentId: { type: Schema.Types.ObjectId, ref: 'CustomerSegment', default: null, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
}, { timestamps: true, versionKey: false });

amountOffOrderEligibilityEntrySchema.index({ storeId: 1, discountId: 1 });

export const AmountOffOrderEligibilityEntry: Model<IAmountOffOrderEligibilityEntry & Document> =
  mongoose.models.AmountOffOrderEligibilityEntry || mongoose.model<IAmountOffOrderEligibilityEntry & Document>('AmountOffOrderEligibilityEntry', amountOffOrderEligibilityEntrySchema);
