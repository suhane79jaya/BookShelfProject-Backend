import { Post } from "../models/Post.js";
import { UserModel } from "../models/User.js";
export const createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: { public_id: "req.body.public_id", url: "req.body.url" },
      owner: req.user._id,
    };
    const post = await Post.create(newPostData);
    const user = await UserModel.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({
      success: true,
      post,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: error.meassge,
    });
  }
};
//Delete post handler
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized",
      });
    }
    await post.deleteOne();
    const user = await UserModel.findById(req.user._id);
    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Like&Unlike post handler
export const likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//FollowUser post handler
export const followUser = async (req, res) => {
  try {
    const userToFollow = await UserModel.findById(req.params.id);
    const loggedInUser = await UserModel.findById(req.user._id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(indexfollowing, 1);
      const indexOfFollowers = userToFollow.followers.indexOf(loggedInUser._id);
      userToFollow.followers.splice(indexOfFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPostOffollowing = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//For updating caption
export const updateCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized",
      });
    }
    post.caption = req.body.caption;
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
