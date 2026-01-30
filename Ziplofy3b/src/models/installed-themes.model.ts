import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInstalledThemes extends Document {
  user: mongoose.Types.ObjectId;
  theme: mongoose.Types.ObjectId;
  isActive: boolean;
  storePath?: string;
  installedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  uninstalledAt?: Date;
}

const InstalledThemesSchema: Schema<IInstalledThemes> = new Schema<IInstalledThemes>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    theme: {
      type: Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    storePath: {
      type: String,
      default: null,
    },
    installedAt: {
      type: Date,
      default: null,
    },
    uninstalledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

// Ensure only one active installation per (user, theme)
InstalledThemesSchema.index(
  { user: 1, theme: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

// Helpful secondary indexes
InstalledThemesSchema.index({ user: 1, theme: 1, createdAt: -1 });
InstalledThemesSchema.index({ theme: 1, isActive: 1 });

export const InstalledThemes: Model<IInstalledThemes> =
  mongoose.models.InstalledThemes ||
  mongoose.model<IInstalledThemes>("InstalledThemes", InstalledThemesSchema);
