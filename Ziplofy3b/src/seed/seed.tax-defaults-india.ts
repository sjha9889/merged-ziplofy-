import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.config';
import { TaxDefault } from '../models/tax-rate-default/tax-rate-default.model';
import { State } from '../models/state/state.model';

dotenv.config();

// India country ID
const INDIA_COUNTRY_ID = '6902f7358dd63bde9269cbfe';

async function seedIndiaTaxDefaults() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Validate India country ID
    if (!mongoose.Types.ObjectId.isValid(INDIA_COUNTRY_ID)) {
      throw new Error(`Invalid India country ID: ${INDIA_COUNTRY_ID}`);
    }

    const indiaObjectId = new mongoose.Types.ObjectId(INDIA_COUNTRY_ID);

    // Fetch all states for India
    const states = await State.find({ countryId: indiaObjectId }).lean();
    
    if (!states || states.length === 0) {
      console.log('No states found for India. Please seed states first.');
      process.exit(0);
    }

    console.log(`Found ${states.length} states for India`);

    // Prepare bulk operations for tax defaults
    const taxDefaultOps = states.map((state) => ({
      updateOne: {
        filter: {
          countryId: indiaObjectId,
          stateId: state._id,
        },
        update: {
          $set: {
            countryId: indiaObjectId,
            stateId: state._id,
            taxLabel: 'IGST',
            taxRate: 18,
            calculationMethod: 'instead',
          },
        },
        upsert: true,
      },
    }));

    // Execute bulk write
    console.log('Creating/updating tax defaults for Indian states...');
    const result = await TaxDefault.bulkWrite(taxDefaultOps as any, { ordered: false });

    console.log('\nTax Defaults Seeding Results:');
    console.log(`  - Matched: ${result.matchedCount}`);
    console.log(`  - Modified: ${result.modifiedCount}`);
    console.log(`  - Upserted: ${result.upsertedCount}`);
    console.log(`  - Total states processed: ${states.length}`);

    // Also create federal/country-level default (stateId = null)
    const federalDefault = await TaxDefault.findOneAndUpdate(
      {
        countryId: indiaObjectId,
        stateId: null,
      },
      {
        $set: {
          countryId: indiaObjectId,
          stateId: null,
          taxLabel: 'Federal GST',
          taxRate: 9,
          calculationMethod: null,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log(`\nFederal tax default ${federalDefault ? 'created/updated' : 'failed'}`);

    console.log('\n✅ India tax defaults seeding completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding India tax defaults:', error);
    process.exit(1);
  }
}

// Run the seed function
seedIndiaTaxDefaults();

