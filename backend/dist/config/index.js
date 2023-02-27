"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSubject = exports.FromAdminMail = exports.GMAIL_PASSWORD = exports.GMAIL_USER = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectMongoDB = async () => {
    mongoose_1.default.set("strictQuery", false);
    const connect = await mongoose_1.default.connect(process.env.DATABASE_URL);
    //   console.log(connect);
    console.log(`Connection to MONGODB is successful`);
};
exports.default = connectMongoDB;
exports.GMAIL_USER = process.env.GMAIL_USER;
exports.GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
exports.FromAdminMail = process.env.fromAdminMail;
exports.userSubject = process.env.userSubject;
