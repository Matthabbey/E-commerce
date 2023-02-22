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
}
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema<UserInstance>({
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
    cart: {
        type: [],
        default: []
    },
    address: [{type: Object, ref: "Address"}],
    wishList: [{type: Object, ref: "Product"}]
},
{
timestamps: true
});

//Export the model
export const UserModel = mongoose.model<UserInstance>('UserData', userSchema);