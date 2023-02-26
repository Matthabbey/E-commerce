import  mongoose from 'mongoose'; // Erase if already required

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
    passwordResetExpires: Date
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

    passwordChangedAt: {type: Date},
    passwordResetToken: {type: String},
    passwordResetExpires: {type: Date}
},
{
timestamps: true
});

//Export the model
export const UserModel = mongoose.model<UserInstance>('UserData', userSchema);