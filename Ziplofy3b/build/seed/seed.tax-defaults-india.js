"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_config_1 = require("../config/database.config");
const tax_rate_default_model_1 = require("../models/tax-rate-default/tax-rate-default.model");
const state_model_1 = require("../models/state/state.model");
dotenv_1.default.config();
// India country ID
const INDIA_COUNTRY_ID = '6902f7358dd63bde9269cbfe';
async function seedIndiaTaxDefaults() {
    try {
        await (0, database_config_1.connectDB)();
        console.log('Connected to database');
        // Validate India country ID
        if (!mongoose_1.default.Types.ObjectId.isValid(INDIA_COUNTRY_ID)) {
            throw new Error(`Invalid India country ID: ${INDIA_COUNTRY_ID}`);
        }
        const indiaObjectId = new mongoose_1.default.Types.ObjectId(INDIA_COUNTRY_ID);
        // Fetch all states for India
        const states = await state_model_1.State.find({ countryId: indiaObjectId }).lean();
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
        const result = await tax_rate_default_model_1.TaxDefault.bulkWrite(taxDefaultOps, { ordered: false });
        console.log('\nTax Defaults Seeding Results:');
        console.log(`  - Matched: ${result.matchedCount}`);
        console.log(`  - Modified: ${result.modifiedCount}`);
        console.log(`  - Upserted: ${result.upsertedCount}`);
        console.log(`  - Total states processed: ${states.length}`);
        // Also create federal/country-level default (stateId = null)
        const federalDefault = await tax_rate_default_model_1.TaxDefault.findOneAndUpdate({
            countryId: indiaObjectId,
            stateId: null,
        }, {
            $set: {
                countryId: indiaObjectId,
                stateId: null,
                taxLabel: 'Federal GST',
                taxRate: 9,
                calculationMethod: null,
            },
        }, {
            upsert: true,
            new: true,
        });
        console.log(`\nFederal tax default ${federalDefault ? 'created/updated' : 'failed'}`);
        console.log('\n✅ India tax defaults seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding India tax defaults:', error);
        process.exit(1);
    }
}
// Run the seed function
seedIndiaTaxDefaults();
