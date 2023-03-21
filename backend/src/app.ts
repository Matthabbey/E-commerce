import createError, { HttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import logger from "morgan";

import productRouter from "./routes/productRoute";
import productCategoryRouter from "./routes/ProductCategoryRoute";
import brandRouter from "./routes/brandRoute";
import blogCategoryRouter from "./routes/blogCategoryRoute";
import blogRouter from "./routes/blogRoute";
import usersRouter from "./routes/usersRoute";
import couponRouter from "./routes/couponRoute";
import connectMongoDB from "./config/index";
dotenv.config();
connectMongoDB();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/products", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product/category", productCategoryRouter);
app.use("/api/blog/category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = 4000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
