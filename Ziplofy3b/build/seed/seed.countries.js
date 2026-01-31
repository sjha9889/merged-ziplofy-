"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_config_1 = require("../config/database.config");
const country_model_1 = require("../models/country/country.model");
const currency_model_1 = require("../models/currency/currency.model");
dotenv_1.default.config();
async function fetchAllCountries() {
    const url = 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,ccn3,region,subregion,flag,currencies';
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`Failed to download countries: ${res.status} ${res.statusText}`);
    return (await res.json());
}
async function fetchAllCurrencies() {
    // Returns object like { "USD": "United States Dollar", ... }
    const url = 'https://openexchangerates.org/api/currencies.json';
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`Failed to download currencies: ${res.status} ${res.statusText}`);
    return (await res.json());
}
async function seedCurrenciesAndCountries() {
    try {
        await (0, database_config_1.connectDB)();
        // 1) Fetch and upsert currencies from standardized API
        const currencyJson = await fetchAllCurrencies();
        const currencyCodes = Object.keys(currencyJson || {}).map((c) => c.toUpperCase());
        if (currencyCodes.length) {
            const currencyOps = currencyCodes.map((code) => {
                const name = currencyJson[code] || code;
                return {
                    updateOne: {
                        filter: { code },
                        update: {
                            $set: {
                                code,
                                name,
                            },
                        },
                        upsert: true,
                    },
                };
            });
            const curRes = await currency_model_1.Currency.bulkWrite(currencyOps, { ordered: false });
            console.log('Currencies seeding completed:', {
                upserted: curRes.upsertedCount,
                modified: curRes.modifiedCount,
                matched: curRes.matchedCount,
            });
        }
        // 2) Build code -> _id map from DB
        const dbCurrencies = await currency_model_1.Currency.find({}, { _id: 1, code: 1 }).lean();
        const currencyMap = new Map();
        for (const cur of dbCurrencies) {
            // @ts-ignore
            currencyMap.set(cur.code, cur._id);
        }
        // 3) Fetch countries and upsert with currency link
        const raw = await fetchAllCountries();
        const ops = raw
            .filter((c) => Boolean(c.cca2) && Boolean(c.cca3) && c.name?.common && c.name?.official)
            .map((c) => {
            const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : undefined;
            const upper = currencyCode ? currencyCode.toUpperCase() : '';
            const currencyId = upper ? currencyMap.get(upper) || null : null;
            return {
                updateOne: {
                    filter: { iso2: c.cca2.toUpperCase() },
                    update: {
                        $set: {
                            name: c.name.common,
                            officialName: c.name.official,
                            iso2: c.cca2.toUpperCase(),
                            iso3: c.cca3.toUpperCase(),
                            numericCode: (c.ccn3 || '').toString(),
                            region: c.region || '',
                            subRegion: c.subregion || '',
                            flagEmoji: c.flag || '',
                            currencyCode: upper,
                            currencyId,
                        },
                    },
                    upsert: true,
                },
            };
        });
        if (ops.length === 0) {
            console.log('No countries to seed.');
            process.exit(0);
        }
        const result = await country_model_1.Country.bulkWrite(ops, { ordered: false });
        console.log('Countries seeding completed:', {
            upserted: result.upsertedCount,
            modified: result.modifiedCount,
            matched: result.matchedCount,
        });
        process.exit(0);
    }
    catch (err) {
        console.error('Error seeding countries:', err);
        process.exit(1);
    }
}
seedCurrenciesAndCountries();
