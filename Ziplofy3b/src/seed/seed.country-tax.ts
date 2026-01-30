import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.config';
import { CountryTax } from '../models/country-tax/country-tax.model';

dotenv.config();

// India country ID
const INDIA_COUNTRY_ID = '6902f7358dd63bde9269cbfe';

async function seedCountryTax() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Validate India country ID
    if (!mongoose.Types.ObjectId.isValid(INDIA_COUNTRY_ID)) {
      throw new Error(`Invalid India country ID: ${INDIA_COUNTRY_ID}`);
    }

    const indiaObjectId = new mongoose.Types.ObjectId(INDIA_COUNTRY_ID);

    // Create or update country tax for India
    console.log('Creating/updating country tax for India...');
    
    const countryTax = await CountryTax.findOneAndUpdate(
      {
        countryId: indiaObjectId,
      },
      {
        $set: {
          countryId: indiaObjectId,
          taxRate: 9,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log('\n✅ Country tax seeded successfully!');
    console.log(`  - Country ID: ${countryTax.countryId.toString()}`);
    console.log(`  - Tax Rate: ${countryTax.taxRate}%`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding country tax:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCountryTax();

