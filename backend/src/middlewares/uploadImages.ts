import multer, { diskStorage } from "multer";
import sharp from "sharp";
import path from "path";
// import route from "../public/images/products"
import { NextFunction, Response, Request } from "express";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.filename + "-" + uniqueSuffix + "jpeg");
  },
});

const multerFilter = (req: Response, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, file);
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
  fileFilter: multerFilter,
  limits: { fieldSize: 200000 },
});

export const productImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file: string) => {
      await sharp(file)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file}`);
    })
  );
  next();
};

export const blogImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file: string) => {
      await sharp(file)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file}`);
    })
  );
  next();
};

