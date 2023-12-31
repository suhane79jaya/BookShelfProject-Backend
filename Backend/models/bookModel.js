import mongoose from "mongoose";
const bookSchema = mongoose.Schema(
  {
    _id: { type: String },
    image: { type: String, required: true },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Book = mongoose.model("Book", bookSchema);
