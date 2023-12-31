import express from "express";
import {
  register,
  login,
  logout,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  myProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { followUser } from "../controllers/postcontroller.js";
export const router = express.Router();
//export const UserRouter = express.Router();
router.route("/register").post(register);
//export const loginRouter = express.Router();
router.route("/login").post(login);

//export const followRouter = express.Router();
router.route("/follow/:id").get(isAuthenticated, followUser);

//export const logoutRouter = express.Router();
router.route("/logout").get(logout);

//export const updatePasswordRouter = express.Router();
router.route("/update/password").put(isAuthenticated, updatePassword);

//export const updateProfileRouter = express.Router();
router.route("/update/profile").put(isAuthenticated, updateProfile);

//export const deleteProfileRouter = express.Router();
router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);
//export const profileRouter = express.Router();
router.route("/me").get(isAuthenticated, myProfile);
export default router;
