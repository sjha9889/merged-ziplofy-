import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRecentInstallations extends Document {
  themeId: string; // Can be regular theme ID or "custom-{customThemeId}"
  themeName: string;
  thumbnailUrl: string | null;
  isCustomTheme: boolean;
  installedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const RecentInstallationsSchema: Schema<IRecentInstallations> = new Schema<IRecentInstallations>(
  {
    themeId: {
      type: String,
      required: true,
      index: true,
    },
    themeName: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    isCustomTheme: {
      type: Boolean,
      default: false,
      index: true,
    },
    installedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Index for sorting by installation date
RecentInstallationsSchema.index({ installedAt: -1 });

export const RecentInstallations: Model<IRecentInstallations> =
  mongoose.models.RecentInstallations ||
  mongoose.model<IRecentInstallations>("RecentInstallations", RecentInstallationsSchema);

