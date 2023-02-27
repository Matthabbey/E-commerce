import  mongoose from 'mongoose'; // Erase if already required
import { createPasswordResetToken } from '../utilities/utils';
import crypto from 'crypto'

export interface UserInstance{
    firstName: string,
    email: string,
    phone: string,
    password: string,
    confirm_password: string,
    lastName: string,
    role: string,
    cart: Array<string>
    address: Object
    wishList: [{type: Object, ref: "Product"}]
    isBlocked: boolean,
    refreshToken: string,
    passwordChangedAt: Date,
    passwordResetToken: string,
    passwordResetExpires: any
    createPasswordResetToken: any
}
// Declare the Schema of the Mongo model
export const userSchema = new mongoose.Schema<UserInstance>({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user"
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    cart: {
        type: [],
        default: []
    },
    address: [{type: Object, ref: "Address"}],
    wishList: [{type: Object, ref: "Product"}],
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
timestamps: true
});


userSchema.methods.createPasswordResetToken = async function(){
    const resettoken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resettoken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resettoken
}

//Export the model
export const UserModel = mongoose.model<UserInstance>('UserData', userSchema);