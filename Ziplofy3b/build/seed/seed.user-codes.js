"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Backfill userCode for users that don't have one.
 * Run: npm run build && npm run seed:user-codes
 */
const dotenv_1 = __importDefault(require("dotenv"));
const database_config_1 = require("../config/database.config");
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateUserCode() {
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
    }
    return code;
}
async function backfillUserCodes() {
    try {
        await (0, database_config_1.connectDB)();
        console.log("Connected to database");
        const usersWithoutCode = await user_model_1.User.find({
            $or: [{ userCode: { $exists: false } }, { userCode: null }, { userCode: "" }],
        })
            .select("_id name email")
            .lean();
        if (usersWithoutCode.length === 0) {
            console.log("All users already have userCode.");
            process.exit(0);
        }
        console.log(`Found ${usersWithoutCode.length} users without userCode.`);
        const existingUsers = await user_model_1.User.find({
            $and: [{ userCode: { $exists: true } }, { userCode: { $ne: null } }, { userCode: { $ne: "" } }],
        })
            .select("userCode")
            .lean();
        const usedCodes = new Set(existingUsers.map((u) => u.userCode).filter(Boolean));
        let updated = 0;
        for (const u of usersWithoutCode) {
            let code = "";
            let attempts = 0;
            do {
                code = generateUserCode();
                if (!usedCodes.has(code))
                    break;
                attempts++;
            } while (attempts < 20);
            if (!code) {
                console.warn(`Could not generate unique code for user ${u._id}`);
                continue;
            }
            await user_model_1.User.updateOne({ _id: u._id }, { $set: { userCode: code.toUpperCase() } });
            usedCodes.add(code);
            updated++;
            console.log(`  ${u.name} (${u._id}) → ${code}`);
        }
        console.log(`\n✅ Backfilled userCode for ${updated} users.`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error backfilling user codes:", error);
        process.exit(1);
    }
}
backfillUserCodes();
