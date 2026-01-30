import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBuyXGetYEligibilityEntry {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  discountId: mongoose.Types.ObjectId; // BuyXGetYDiscount
  customerSegmentId?: mongoose.Types.ObjectId | null;
  customerId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const eligibilityEntrySchema = new Schema<IBuyXGetYEligibilityEntry & Document>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  discountId: { type: Schema.Types.ObjectId, ref: 'BuyXGetYDiscount', required: true, index: true },
  customerSegmentId: { type: Schema.Types.ObjectId, ref: 'CustomerSegment', default: null, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
}, { timestamps: true, versionKey: false });

eligibilityEntrySchema.index({ storeId: 1, discountId: 1 });

export const BuyXGetYEligibilityEntry: Model<IBuyXGetYEligibilityEntry & Document> =
  mongoose.models.BuyXGetYEligibilityEntry || mongoose.model<IBuyXGetYEligibilityEntry & Document>('BuyXGetYEligibilityEntry', eligibilityEntrySchema);
