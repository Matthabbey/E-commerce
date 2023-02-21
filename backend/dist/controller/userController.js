"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.CreateUser = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utilities/utils");
const CreateUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, password, email } = req.body;
        //Generate Salt
        const salt = await (0, utils_1.GenerateSalt)();
        const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const findUser = await userModel_1.UserModel.findOne({ email: email });
        if (!findUser) {
            const newUser = await userModel_1.UserModel.create({
                firstName,
                lastName,
                phone,
                password: userPassword,
                email,
                salt,
            });
            return res.status(201).json({
                messsage: "User successfully created",
                newUser,
            });
        }
        return res.status(400).json({
            message: "User already exit",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/signup",
        });
        console.log(error);
    }
};
exports.CreateUser = CreateUser;
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check if the user exist
        const User = await userModel_1.UserModel.findOne({ email });
        const validation = await bcrypt_1.default.compare(password, User.password);
        if (validation) {
            // const validation = await bcrypt.compare(password, User?.password)
            return res.status(200).json({
                message: "You have successfully logged in",
                email: User?.email,
                firstName: User?.firstName,
                lastName: User?.lastName,
            });
        }
        return res
            .status(400)
            .json({ message: "Wrong Username or password / not varified user" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/signup",
        });
    }
};
exports.Login = Login;
function GenerateSignature(arg0) {
    throw new Error("Function not implemented.");
}
