import multer, { diskStorage } from "multer";
import sharp from "sharp";
import path from "path";
// import route from "../public/images/products"
import { NextFunction, Response, Request } from "express";

const multerStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, path.join(__dirname, "../public/images"))
  },
  filename: function(req, file, cb){
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.filename + "-" + uniqueSuffix + "jpeg")
  }
})

const multerFilter = (req: any, file: any, cb: any) =>{

}

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {fieldSize: 200000}
})