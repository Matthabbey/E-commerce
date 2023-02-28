"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockedUser = exports.ResetPassword = exports.ForgotPasswordToken = exports.UpdatedPassword = exports.blockedUser = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.Logout = exports.handleRefreshToken = exports.Login = exports.CreateUser = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utilities/utils");
const crypto_1 = __importDefault(require("crypto"));
const refreshToken_1 = require("../config/refreshToken");
const sendMail_1 = require("../utilities/sendMail");
const config_1 = require("../config");
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
            Error: `Internal Server ${error}`,
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
            Error: `Internal Server ${error}`,
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
            Error: `Internal Server ${err}`,
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
            Error: `Internal Server ${error}`,
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
            Error: `Internal Server ${error}`,
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
/*================= forgot Password ================*/
// export const UpdatePassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email } = req.body;
//     const message = `${email}`
//     const user = (await UserModel.findOne({
//       where: { email: email },
//     })) as unknown as UserInstance;
//     if (!user) {
//       // __TEST MESSAGE__ wrong message this should be an error
//       return res.status(200).json({
//         code: 200,
//         message: "Check Your Email to Continue now !!",
//       });
//     } else {
//       const otp = await GenerateSalt();
//       let token = await GenerateSignature({
//         email,
//         otp,
//       });
//       const newP = await UserModel.findOneAndUpdate(
//         {
//           otp: otp,
//         },
//         {
//           where: { _id: user._id },
//         }
//       );
//     // await mailSent(FromAdminMail, email, userSubject, message);
//       // __TEST MESSAGE__ dont send token as response or user will be able to reset pwd without checking email
//       res.status(200).json({
//         signature: newP,
//         message: "Check Your Email to Continue !!",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
// export const UpdatePassword = async (req: Request, res: Response) => {
//   const { _id } = req.user;
//   // console.log(_id);
//   try {
//     const password  = req.body;
//     validateMongoId(_id);
//     // const newPassword : any =  await createPasswordResetToken(password)
//     const user = await UserModel.findById(_id);
//     console.log(user?.password);
//     console.log("heyyy senior man");
//     // const isMatch = await bcrypt.compare(password, user!.password)
//     // if(!isMatch) return res.status(404).json('There is no matched password')
//     if(password === user!.password){
//       return res.status(404).json('New password must be different from the old password');
//     }
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//       user!.password = hashedPassword;
//       const newPassword = await user?.save();
//       return res
//         .status(200)
//         .json({ message: "Password Successfully Updated", newPassword });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: `Internal error ${error}`,
//       route: "user/update-password router",
//     });
//   }
// };
const UpdatedPassword = async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    const salt = await (0, utils_1.GenerateSalt)();
    const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
    (0, utils_1.validateMongoId)(_id);
    const user = await userModel_1.UserModel.findById(_id);
    console.log(user);
    if (userPassword) {
        user.password = userPassword;
        console.log(user);
        const updatedPassword = await user?.save();
        res.json(updatedPassword);
    }
    else {
        res.json(user);
    }
};
exports.UpdatedPassword = UpdatedPassword;
const ForgotPasswordToken = async (req, res) => {
    const { email } = req.body;
    const user = await userModel_1.UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "There is no user with this email",
        });
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password.This link is valid till 10 minutes from now. <a href='http://localhost:4000/api/users/reset-password/${token}'>Please Click Here</a>`;
        await (0, sendMail_1.mailSent)(config_1.FromAdminMail, email, config_1.userSubject, resetURL);
        console.log(token);
        return res.status(200).json(token);
    }
    catch (error) {
        res.status(500).json({
            message: `Internal error ${error}`,
            route: "user/ForgotPasswordToken router",
        });
    }
};
exports.ForgotPasswordToken = ForgotPasswordToken;
const ResetPassword = async (req, res) => {
    const { password } = req.body;
    const salt = await (0, utils_1.GenerateSalt)();
    const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
    const { token } = req.params;
    const hashToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await userModel_1.UserModel.findOne({
        passwordResetToken: hashToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(404).json({
            message: "Token Expired, Please try again later.",
        });
    }
    user.password = userPassword;
    user.passwordResetToken = "null";
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json(user);
};
exports.ResetPassword = ResetPassword;
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
