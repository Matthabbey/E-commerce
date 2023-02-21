"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
const userModel_1 = require("../models/userModel");
const CreateUser = async (req, res) => {
    try {
        const { firstName, lastName, phone, password, email } = req.body;
        const findUser = await userModel_1.UserModel.findOne({ email: email });
        if (!findUser) {
            const newUser = await userModel_1.UserModel.create({
                firstName,
                lastName,
                phone,
                password,
                email,
            });
            return res.status(201).json({
                messsage: "User successfully created",
                newUser
            });
        }
        return res.status(400).json({
            message: "User already exit",
        });
    }
    catch (error) { }
};
exports.CreateUser = CreateUser;
