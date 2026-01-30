import mongoose, { Document, Model, Schema } from "mongoose";

// Theme Category Types
export type ThemeCategory = "travel" | "business" | "portfolio" | "ecommerce" | "blog" | "education" | "health" | "food";

// Theme Plan Types
export type ThemePlan = "free" | "basic" | "premium" | "enterprise";

export interface ITheme extends Document {
  name: string;
  description?: string;
  category: ThemeCategory;
  plan: ThemePlan;
  price?: number;
  themePath: string;
  directories: {
    theme: string;
    code: string;
    zipped: string;
    thumbnail: string;
  };
  zipFile?: {
    originalName?: string;
    size?: number;
    extractedPath?: string;
    uploadDate?: Date;
  };
  thumbnail?: {
    filename?: string;
    originalName?: string;
    path?: string;
    size?: number;
    uploadDate?: Date;
  };
  version?: string;
  tags?: string[];
  isActive?: boolean;
  downloads?: number;
  installationCount?: number;
  rating?: {
    average?: number;
    count?: number;
  };
  uploadBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ThemeSchema: Schema<ITheme> = new Schema<ITheme>({
  name: {
    type: String,
    required: [true, "Theme name is required"],
    trim: true,
    maxLength: [100, "Theme name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    maxLength: [500, "Description cannot exceed 500 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "travel",
      "business",
      "portfolio",
      "ecommerce",
      "blog",
      "education",
      "health",
      "food",
    ],
  },
  plan: {
    type: String,
    required: [true, "Plan is required"],
    enum: ["free", "basic", "premium", "enterprise"],
  },
  price: {
    type: Number,
    default: 0,
  },
  themePath: {
    type: String,
    required: true,
    unique: true,
  },
  directories: {
    theme: { type: String, required: true },
    code: { type: String, required: true },
    zipped: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  zipFile: {
    originalName: String,
    size: Number,
    extractedPath: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  thumbnail: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  version: {
    type: String,
    default: "1.0.0",
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  installationCount: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  uploadBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp before saving
ThemeSchema.pre<ITheme>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for search functionality
ThemeSchema.index({ name: "text", description: "text", tags: "text" });

export const Theme: Model<ITheme> = mongoose.models.Theme || mongoose.model<ITheme>("Theme", ThemeSchema);
