import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const CategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    }
},
{
    timestamps: true
});

//Export the model
export const CategoryModel = mongoose.model('Category', CategorySchema);