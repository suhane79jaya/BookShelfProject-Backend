import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter  a name"],
    },
    avatar: [{ public_id: String, url: String }],

    email: {
      type: String,
      required: [true, "Please enter  a email"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Please enter  a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
UserSchema.methods.matchPassword = async function (password) {
  // console.log(password, this.password, this.email, this.name);
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, `${process.env.JWT_SECRET}`);
};
export const UserModel = mongoose.model("User", UserSchema);
