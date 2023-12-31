import { UserModel } from "../models/User.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    //console.log("token", token);
    //console.log("req.cookie", req.cookies.token);
    if (!token) {
      return res.status(401).json({
        message: "Please Login first",
      });
    }
    const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.user = await UserModel.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
