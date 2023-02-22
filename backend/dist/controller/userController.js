"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.Login = exports.CreateUser = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utilities/utils");
const CreateUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, password, email, confirm_password } = req.body;
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
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
            const signature = await (0, utils_1.GenerateSignature)({
                _id: User?._id,
                email: User?.email,
            });
            // const validation = await bcrypt.compare(password, User?.password)
            return res.status(200).json({
                message: "You have successfully logged in",
                email: User?.email,
                signature
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
const getAllUsers = async (req, res) => {
    try {
        //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
        const users = await userModel_1.UserModel.find();
        return res.status(200).json({
            message: "You have successfully retrieved all users in your database",
            User: users
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "users/get-all-users",
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
        const users = await userModel_1.UserModel.findById(req.params.id);
        return res.status(200).json({
            message: "You have successfully retrieved all users in your database",
            User: users
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "users/get-all-users",
        });
    }
};
exports.getSingleUser = getSingleUser;
const updateUser = async (req, res) => {
    try {
        const update = await userModel_1.UserModel.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({
            message: "Successfully updated",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            route: "todo/update router",
        });
    }
};
exports.updateUser = updateUser;
/** ========================DELETE TODO LIST ============================*/
const deleteUser = async (req, res) => {
    try {
        const deleteMe = await userModel_1.UserModel.findByIdAndDelete(req.params.id);
        if (!deleteMe) {
            return res.status(404).json({
                message: "This item has been deleted",
            });
        }
        return res.status(200).json({
            message: "You have successfully deleted your TODO item",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            route: "todo/delete router",
        });
    }
};
exports.deleteUser = deleteUser;
