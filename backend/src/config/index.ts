import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectMongoDB = async () => {
  mongoose.set("strictQuery", false);
  const connect = await mongoose.connect(process.env.DATABASE_URL!);
//   console.log(connect);
  console.log(`Connection to MONGODB is successful`);
};

export default connectMongoDB;

export const GMAIL_USER = process.env.GMAIL_USER
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD
export const FromAdminMail = process.env.fromAdminMail as string
export const userSubject = process.env.userSubject as string

console.log(GMAIL_USER);

