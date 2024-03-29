import express from "express";
import {
  AddToWishList,
  CreateProduct,
  DeleteProduct,
  GetAllProducts,
  GetSingleProduct,
  Rating,
  UpdateProduct,
  uploadProductImage,
} from "../controller/productController";
import { authMiddleware, isAdmin } from "../middlewares/authRoutes";
import { productImageResize, upload } from "../middlewares/uploadImages";
const router = express.Router();

/* GET home page. */
router.post("/create", authMiddleware, isAdmin, CreateProduct);

// router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), uploadProductImage, productImageResize)
// router.post(
//   "/upload/:id",
//   authMiddleware,
//   isAdmin,
//   upload,
//   // productImageResize,
//   uploadProductImage
// );

router.put("/upload:id",upload,  function(req, res){
  try {
    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
      });
  
    } else {
      console.log('file received');
      return res.send({
        success: true
      })
    }
  } catch (error) {
    console.log("error");
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/product/upload",
    });
  }
})
router.put("/wishlist", authMiddleware, AddToWishList);
router.put("/rating", authMiddleware, Rating);
router.get("/get-products", GetAllProducts);
router.get("/single-product/:id", authMiddleware, isAdmin, GetSingleProduct);
router.put("/update/:id", authMiddleware, isAdmin, UpdateProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, DeleteProduct);

export default router;
