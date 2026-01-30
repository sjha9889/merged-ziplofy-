import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFreeShippingEligibilityEntry {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  discountId: mongoose.Types.ObjectId; // FreeShippingDiscount
  customerSegmentId?: mongoose.Types.ObjectId | null;
  customerId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const freeShippingEligibilityEntrySchema = new Schema<IFreeShippingEligibilityEntry & Document>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  discountId: { type: Schema.Types.ObjectId, ref: 'FreeShippingDiscount', required: true, index: true },
  customerSegmentId: { type: Schema.Types.ObjectId, ref: 'CustomerSegment', default: null, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
}, { timestamps: true, versionKey: false });

freeShippingEligibilityEntrySchema.index({ storeId: 1, discountId: 1 });

export const FreeShippingEligibilityEntry: Model<IFreeShippingEligibilityEntry & Document> =
  mongoose.models.FreeShippingEligibilityEntry || mongoose.model<IFreeShippingEligibilityEntry & Document>('FreeShippingEligibilityEntry', freeShippingEligibilityEntrySchema);
