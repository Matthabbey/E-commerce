import multer from "multer";
import sharp from "sharp";
import path from "path";
// import route from "../public/images/products"
import { NextFunction, Response, Request } from "express";

// configure multer storage
const multerStorage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cd) {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cd(null, file.fieldname + "-" + suffix + ".jpeg");
  },
});

// configure multer upload settings
function multerFilter({ req, file, cb }: any) {
  if (file.mimetype.startsWith("images")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
}
export const uploadPhoto = multer({
  storage: multerStorage,

  limits: { fileSize: 2000000 },
  //   fileFilter: multerFilter
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("images")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
// console.log(uploadPhoto);

export const productImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { files } = req;
    if (!files || !Array.isArray(files)) {
      throw new Error("No files uploaded");
    }
    console.log("1");

    console.log(files, "2");
    files.map(async (file: Express.Multer.File) => {
      const { path, filename } = file;
      console.log(path, "3");

      sharp(path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${filename}`);
    });

    console.log(files, "4");
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const blogImageResize = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { files } = req;
//     if (!files || !Array.isArray(files)) {
//       throw new Error("No files uploaded");
//     }

//     await Promise.all(
//       files.map(async (file: Express.Multer.File) => {
//         const { path, filename } = file;
//         await sharp(path)
//           .resize(300, 300)
//           .toFormat("jpeg")
//           .jpeg({ quality: 90 })

//           .toFile(`public/images/blog/${file.filename}`);
//       })
//     );
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const productImageResize = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.files) res.json({ msg: "not successfully" });

//   await Promise.all(

//     files?.map(async (file: any) => {

//         console.log("now here");
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/products/${file.filename}`);
//     })
//   );
//   next();
// };

// export const productImageResize = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//     const files = req.files
//   if (!req.files){
//           throw new Error("No files uploaded");
//           }
//           console.log(req.files, "1");

//   await Promise.all(
//     files.map(async (file: any) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/blogs/${file.filename}`);
//     })
//   );
//   next();
// };
