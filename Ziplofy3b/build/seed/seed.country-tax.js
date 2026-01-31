"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_config_1 = require("../config/database.config");
const country_tax_model_1 = require("../models/country-tax/country-tax.model");
dotenv_1.default.config();
// India country ID
const INDIA_COUNTRY_ID = '6902f7358dd63bde9269cbfe';
async function seedCountryTax() {
    try {
        await (0, database_config_1.connectDB)();
        console.log('Connected to database');
        // Validate India country ID
        if (!mongoose_1.default.Types.ObjectId.isValid(INDIA_COUNTRY_ID)) {
            throw new Error(`Invalid India country ID: ${INDIA_COUNTRY_ID}`);
        }
        const indiaObjectId = new mongoose_1.default.Types.ObjectId(INDIA_COUNTRY_ID);
        // Create or update country tax for India
        console.log('Creating/updating country tax for India...');
        const countryTax = await country_tax_model_1.CountryTax.findOneAndUpdate({
            countryId: indiaObjectId,
        }, {
            $set: {
                countryId: indiaObjectId,
                taxRate: 9,
            },
        }, {
            upsert: true,
            new: true,
        });
        console.log('\n✅ Country tax seeded successfully!');
        console.log(`  - Country ID: ${countryTax.countryId.toString()}`);
        console.log(`  - Tax Rate: ${countryTax.taxRate}%`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding country tax:', error);
        process.exit(1);
    }
}
// Run the seed function
seedCountryTax();
