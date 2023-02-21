import mongoose from "mongoose";
import dotenv from "dotenv";

const connectMongoDB = async () => {
  mongoose.set("strictQuery", false);
  const connect = await mongoose.connect(process.env.DATABASE_URL!);
//   console.log(connect);
  console.log(`Connection to MONGODB is successful`);
};

export default connectMongoDB;
