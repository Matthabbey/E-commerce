"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.GenerateSignature = exports.validatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generating of salt code
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
};
exports.validatePassword = validatePassword;
//generating token or signature for the user.
const GenerateSignature = async (_id) => {
    return jsonwebtoken_1.default.sign(_id, process.env.SECRET, { expiresIn: "1d" }); //for week use 'w', for month use 'm', for day use 'd', for minutes use 'min', for hour use 'hour'
};
exports.GenerateSignature = GenerateSignature;
//Verifying the signature of the user before allowing login
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, process.env.SECRET);
};
exports.verifySignature = verifySignature;
