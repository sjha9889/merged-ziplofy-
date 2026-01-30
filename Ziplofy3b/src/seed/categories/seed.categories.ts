import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../config/database.config";
import { Category, ICategory } from "../../models/category/category.model";

// Load environment variables
dotenv.config();

const categoryTree = {
    "X1": {
      "X1.1": {
        "X1.1.1": {},
        "X1.1.2": {},
        "X1.1.3": {},
        "X1.1.4": {},
        "X1.1.5": {}
      },
      "X1.2": {
        "X1.2.1": {},
        "X1.2.2": {},
        "X1.2.3": {},
        "X1.2.4": {},
        "X1.2.5": {}
      },
      "X1.3": {
        "X1.3.1": {},
        "X1.3.2": {},
        "X1.3.3": {},
        "X1.3.4": {},
        "X1.3.5": {}
      },
      "X1.4": {
        "X1.4.1": {},
        "X1.4.2": {},
        "X1.4.3": {},
        "X1.4.4": {},
        "X1.4.5": {}
      },
      "X1.5": {
        "X1.5.1": {},
        "X1.5.2": {},
        "X1.5.3": {},
        "X1.5.4": {},
        "X1.5.5": {}
      }
    },
    "X2": {
      "X2.1": {
        "X2.1.1": {},
        "X2.1.2": {},
        "X2.1.3": {},
        "X2.1.4": {},
        "X2.1.5": {}
      },
      "X2.2": {
        "X2.2.1": {},
        "X2.2.2": {},
        "X2.2.3": {},
        "X2.2.4": {},
        "X2.2.5": {}
      },
      "X2.3": {
        "X2.3.1": {},
        "X2.3.2": {},
        "X2.3.3": {},
        "X2.3.4": {},
        "X2.3.5": {}
      },
      "X2.4": {
        "X2.4.1": {},
        "X2.4.2": {},
        "X2.4.3": {},
        "X2.4.4": {},
        "X2.4.5": {}
      },
      "X2.5": {
        "X2.5.1": {},
        "X2.5.2": {},
        "X2.5.3": {},
        "X2.5.4": {},
        "X2.5.5": {}
      }
    },
    "X3": {
      "X3.1": {
        "X3.1.1": {},
        "X3.1.2": {},
        "X3.1.3": {},
        "X3.1.4": {},
        "X3.1.5": {}
      },
      "X3.2": {
        "X3.2.1": {},
        "X3.2.2": {},
        "X3.2.3": {},
        "X3.2.4": {},
        "X3.2.5": {}
      },
      "X3.3": {
        "X3.3.1": {},
        "X3.3.2": {},
        "X3.3.3": {},
        "X3.3.4": {},
        "X3.3.5": {}
      },
      "X3.4": {
        "X3.4.1": {},
        "X3.4.2": {},
        "X3.4.3": {},
        "X3.4.4": {},
        "X3.4.5": {}
      },
      "X3.5": {
        "X3.5.1": {},
        "X3.5.2": {},
        "X3.5.3": {},
        "X3.5.4": {},
        "X3.5.5": {}
      }
    },
    "X4": {
      "X4.1": {
        "X4.1.1": {},
        "X4.1.2": {},
        "X4.1.3": {},
        "X4.1.4": {},
        "X4.1.5": {}
      },
      "X4.2": {
        "X4.2.1": {},
        "X4.2.2": {},
        "X4.2.3": {},
        "X4.2.4": {},
        "X4.2.5": {}
      },
      "X4.3": {
        "X4.3.1": {},
        "X4.3.2": {},
        "X4.3.3": {},
        "X4.3.4": {},
        "X4.3.5": {}
      },
      "X4.4": {
        "X4.4.1": {},
        "X4.4.2": {},
        "X4.4.3": {},
        "X4.4.4": {},
        "X4.4.5": {}
      },
      "X4.5": {
        "X4.5.1": {},
        "X4.5.2": {},
        "X4.5.3": {},
        "X4.5.4": {},
        "X4.5.5": {}
      }
    },
    "X5": {
      "X5.1": {
        "X5.1.1": {},
        "X5.1.2": {},
        "X5.1.3": {},
        "X5.1.4": {},
        "X5.1.5": {}
      },
      "X5.2": {
        "X5.2.1": {},
        "X5.2.2": {},
        "X5.2.3": {},
        "X5.2.4": {},
        "X5.2.5": {}
      },
      "X5.3": {
        "X5.3.1": {},
        "X5.3.2": {},
        "X5.3.3": {},
        "X5.3.4": {},
        "X5.3.5": {}
      },
      "X5.4": {
        "X5.4.1": {},
        "X5.4.2": {},
        "X5.4.3": {},
        "X5.4.4": {},
        "X5.4.5": {}
      },
      "X5.5": {
        "X5.5.1": {},
        "X5.5.2": {},
        "X5.5.3": {},
        "X5.5.4": {},
        "X5.5.5": {}
      }
    }
};

 
async function insertCategoryTree(tree: any, parentId: mongoose.Types.ObjectId | null = null) {
  for (const [name, children] of Object.entries(tree)) {
    // Insert category
    const category = await Category.create({
      name,
      parent: parentId,
      hasChildren: Object.keys(children as object).length > 0
    }) as ICategory;

    // Recursive call if there are subcategories
    if (Object.keys(children as object).length > 0) {
      await insertCategoryTree(children, category._id);
    }
  }
}

async function seedCategories() {
  try {
    // Connect to database first
    await connectDB();
    
    // Clear existing data
    await Category.deleteMany({});
    
    // Insert the category tree
    await insertCategoryTree(categoryTree);
    
    console.log("Categories seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
}

seedCategories();