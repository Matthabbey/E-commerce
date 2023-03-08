import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface file{
fileToUpload: string
}

export const cloudinaryUploadImage = async(fileToUpload: file)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload, (result: any)=>{
            resolve(
                {
                    url: result.secure._url
                }
            )
        })
    })
}

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "E-COMMERCE",
//     };
//   },
// });

// export const upload = multer({ storage: storage });
