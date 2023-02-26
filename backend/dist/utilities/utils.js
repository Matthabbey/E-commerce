"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMongoId = exports.verifySignature = exports.GenerateSignature = exports.validatePassword = exports.createPasswordResetToken = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.registerSchema = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/[a-z0-9]{3,30}/),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    // confirm_password: Joi.ref('password')
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match here" }),
});
//To remove the unnecessary character that includes in console.log output of the user error message.
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
// Generating of salt code
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const createPasswordResetToken = async (token) => {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    let passwordResetToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
    let passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return passwordResetToken;
};
exports.createPasswordResetToken = createPasswordResetToken;
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
const validateMongoId = (id) => {
    const isValid = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isValid) {
        Error("Invalid ID");
    }
};
exports.validateMongoId = validateMongoId;
