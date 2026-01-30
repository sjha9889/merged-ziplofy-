import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAmountOffProductsEligibilityEntry {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  discountId: mongoose.Types.ObjectId; // references AmountOffProductsDiscount
  customerSegmentId?: mongoose.Types.ObjectId | null; // for specific-customer-segments
  customerId?: mongoose.Types.ObjectId | null; // for specific-customers
  createdAt: Date;
  updatedAt: Date;
}

const amountOffProductsEligibilityEntrySchema = new Schema<IAmountOffProductsEligibilityEntry & Document>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  discountId: { type: Schema.Types.ObjectId, ref: 'AmountOffProductsDiscount', required: true, index: true },
  customerSegmentId: { type: Schema.Types.ObjectId, ref: 'CustomerSegment', default: null, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null, index: true },
}, {
  timestamps: true,
  versionKey: false,
});

// Ensure at least one of customerSegmentId or customerId is provided
amountOffProductsEligibilityEntrySchema.pre('validate', function(next) {
  const doc = this as unknown as IAmountOffProductsEligibilityEntry & Document;
  if (!doc.customerSegmentId && !doc.customerId) {
    return next(new Error('Either customerSegmentId or customerId is required'));
  }
  next();
});

// Compound indexes for better query performance
amountOffProductsEligibilityEntrySchema.index({ storeId: 1, discountId: 1 });
amountOffProductsEligibilityEntrySchema.index({ storeId: 1, customerSegmentId: 1 });
amountOffProductsEligibilityEntrySchema.index({ storeId: 1, customerId: 1 });

// Check if model already exists to prevent duplicate registration
const AmountOffProductsEligibilityEntry: Model<IAmountOffProductsEligibilityEntry & Document> = 
  mongoose.models.AmountOffProductsEligibilityEntry || 
  mongoose.model<IAmountOffProductsEligibilityEntry & Document>('AmountOffProductsEligibilityEntry', amountOffProductsEligibilityEntrySchema);

export { AmountOffProductsEligibilityEntry };
