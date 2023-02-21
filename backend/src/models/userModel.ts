import  mongoose from 'mongoose'; // Erase if already required

interface UserInstance{
    firstName: string,
    email: string,
    phone: string,
    password: string,
    lastName: string
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
});

//Export the model
export const UserModel = mongoose.model<UserInstance>('UserData', userSchema);