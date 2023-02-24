"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockedUser = exports.UpdatePassword = exports.blockedUser = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.Logout = exports.handleRefreshToken = exports.Login = exports.CreateUser = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utilities/utils");
const refreshToken_1 = require("../config/refreshToken");
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
        if (User) {
            const refreshToken = await (0, refreshToken_1.GenerateRefreshToken)(User?._id);
            const updateUser = await userModel_1.UserModel.findOneAndUpdate(User?._id, {
                refreshToen: refreshToken,
            }, {
                new: true,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            console.log(refreshToken);
        }
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
                signature,
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
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        return res.status(404).json({ message: "No Refresh Token in Cookies" });
    }
    const refreshToken = cookies.refreshToken;
    const user = await userModel_1.UserModel.findOne({ refreshToken });
    if (!user) {
        return res
            .status(404)
            .json({ message: "No Refresh Token in db or not matched" });
    }
    const accessToken = await (0, refreshToken_1.GenerateRefreshToken)(refreshToken);
    return res.json(accessToken);
};
exports.handleRefreshToken = handleRefreshToken;
const Logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        return res.status(404).json({ message: "No Refresh Token in Cookies" });
    }
    const refreshToken = cookies.refreshToken;
    const user = await userModel_1.UserModel.findOneAndUpdate({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await userModel_1.UserModel.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
};
exports.Logout = Logout;
const getAllUsers = async (req, res) => {
    try {
        //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
        const users = await userModel_1.UserModel.find();
        return res.status(200).json({
            message: "You have successfully retrieved all users in your database",
            User: users,
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
            User: users,
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
    const id = req.params.id;
    (0, utils_1.validateMongoId)(id);
    try {
        const update = await userModel_1.UserModel.findByIdAndUpdate(id, req.body);
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
    const id = req.params.id;
    (0, utils_1.validateMongoId)(id);
    try {
        const deleteMe = await userModel_1.UserModel.findByIdAndDelete(id);
        if (!deleteMe) {
            return res.status(404).json({
                message: "This item has been deleted",
            });
        }
        return res.status(200).json({
            message: "Successfully deleted",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            route: "user/delete router",
        });
    }
};
exports.deleteUser = deleteUser;
const blockedUser = async (req, res) => {
    const { id } = req.params;
    (0, utils_1.validateMongoId)(id);
    try {
        const blocked = await userModel_1.UserModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        return res.status(200).json({
            message: `This user is blocked`,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Internal error ${error}`,
            route: "user/delete router",
        });
    }
};
exports.blockedUser = blockedUser;
const UpdatePassword = async (req, res) => {
    const { _id } = req.user;
    // console.log(_id);
    try {
        const { password } = req.body;
        (0, utils_1.validateMongoId)(_id);
        const newPassword = (await (0, utils_1.createPasswordResetToken)(password));
        const user = await userModel_1.UserModel.findById(_id);
        if (password) {
            user.password = newPassword;
            const updatedtPassword = await user?.save();
            return res.status(200).json({ message: "Password Successfully Updated", updatedtPassword });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({
            message: `Internal error ${error}`,
            route: "user/update-password router",
        });
    }
};
exports.UpdatePassword = UpdatePassword;
const unblockedUser = async (req, res) => {
    const { id } = req.params;
    (0, utils_1.validateMongoId)(id);
    try {
        const unblocked = await userModel_1.UserModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        return res.status(200).json({
            message: `This user is unblocked`,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Internal error ${error}`,
            route: "user/delete router",
        });
    }
};
exports.unblockedUser = unblockedUser;
