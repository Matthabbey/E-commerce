import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const blogCategorySchema = new mongoose.Schema({
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
export const BlogCategoryModel = mongoose.model('BlogCategory', blogCategorySchema);