"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoDB = async () => {
    mongoose_1.default.set("strictQuery", false);
    const connect = await mongoose_1.default.connect(process.env.DATABASE_URL);
    //   console.log(connect);
    console.log(`Connection to MONGODB is successful`);
};
exports.default = connectMongoDB;
