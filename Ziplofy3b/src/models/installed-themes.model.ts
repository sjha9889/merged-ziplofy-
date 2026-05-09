import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInstalledThemes extends Document {
  store: mongoose.Types.ObjectId;
  // Deprecated: kept temporarily for backward compatibility with old records.
  user?: mongoose.Types.ObjectId;
  theme: mongoose.Types.ObjectId;
  storePath?: string;
  installedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  uninstalledAt?: Date;
}

const InstalledThemesSchema: Schema<IInstalledThemes> = new Schema<IInstalledThemes>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    // Deprecated field retained so old documents still deserialize cleanly.
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    theme: {
      type: Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
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

// Ensure one installation record per (store, theme)
InstalledThemesSchema.index({ store: 1, theme: 1 }, { unique: true });

// Helpful secondary indexes
InstalledThemesSchema.index({ store: 1, theme: 1, createdAt: -1 });
InstalledThemesSchema.index({ theme: 1, installedAt: -1 });

export const InstalledThemes: Model<IInstalledThemes> =
  mongoose.models.InstalledThemes ||
  mongoose.model<IInstalledThemes>("InstalledThemes", InstalledThemesSchema);
