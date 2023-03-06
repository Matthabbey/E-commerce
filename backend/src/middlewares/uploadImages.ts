import multer from "multer";
import sharp from "sharp";
import path from "path";
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
const multerFilter = ({ req, file, cb }: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};
export const uploadPhoto = multer({
    storage: multerStorage,
    limits: { fileSize: 2000000 },
    // fileFilter: multerFilter
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      }
  });

export const productImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file: any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
    })
  );
  next()
};

export const blogsImageResize = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.files) return next();
    await Promise.all(
      req.files.map(async (file: any) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/blogs/${file.filename}`);
      })
    );
    next()
  };


