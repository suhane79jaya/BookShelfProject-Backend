import { UserModel } from "../models/User.js";
import { Post } from "../models/Post.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }
    user = await UserModel.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "sample_url" },
    });
    const token = await user.generateToken();
    const Options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, Options).json({
      success: true,
      message: "user registered successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exists",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    const token = await user.generateToken();
    const Options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, Options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//logout handler
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({ successs: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//For updating password
export const updatePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword || newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password",
      });
    }
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const { name, email } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    //User Avatar TODO
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//For Profile deletion
export const deleteMyProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const posts = user.posts;
    await user.deleteOne();
    //logout user after deleting the profile
    res.cookie("token", null, { expire: new Date(Date.now()), httpOnly: true });

    //deleting all post from users
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await post.deleteOne();
    }
    res.status(200).json({
      success: true,
      message: "Profile deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//for seeing your profile information
export const myProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate("posts");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
