import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBuyXGetYGetsEntry {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  discountId: mongoose.Types.ObjectId; // BuyXGetYDiscount
  productId?: mongoose.Types.ObjectId | null;
  collectionId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const getsEntrySchema = new Schema<IBuyXGetYGetsEntry & Document>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  discountId: { type: Schema.Types.ObjectId, ref: 'BuyXGetYDiscount', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null, index: true },
  collectionId: { type: Schema.Types.ObjectId, ref: 'Collections', default: null, index: true },
}, { timestamps: true, versionKey: false });

getsEntrySchema.index({ storeId: 1, discountId: 1 });

export const BuyXGetYGetsEntry: Model<IBuyXGetYGetsEntry & Document> =
  mongoose.models.BuyXGetYGetsEntry || mongoose.model<IBuyXGetYGetsEntry & Document>('BuyXGetYGetsEntry', getsEntrySchema);
