import express from "express";
import {
  createPost,
  deletePost,
  getPostOffollowing,
  likeAndUnlikePost,
  updateCaption,
} from "../controllers/postcontroller.js";
import { isAuthenticated } from "../middlewares/auth.js";
export const router = express.Router();
router.route("/post/upload").post(isAuthenticated, createPost);
router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deletePost);
router.route("/posts").get(isAuthenticated, getPostOffollowing);
export default router;
