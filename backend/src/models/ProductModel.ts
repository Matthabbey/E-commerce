import mongoose from "mongoose"; // Erase if already required
export interface ProductInstance {
  title: string;
  slug: string;
  sold: number;
  description: "";
  price: number;
  category: {};
  brand: string;
  quantity: number;
  images: [];
  color: string; 
  ratings: [];
  totalratings: string|number
}
// Declare the Schema of the Mongo model
 export const productSchema = new mongoose.Schema<ProductInstance>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    sold: {
      type: Number,
      default: 0,
      select: false
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [],
    },
    color: {
      type: String,
      required: true,
    },
    totalratings: {
      type: String,
      default: 0
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserData",
        },
      },
    ],
    
  },
  { timestamps: true }
);

//Export the model
export const ProductModel = mongoose.model<ProductInstance>(
  "Product",
  productSchema
);
