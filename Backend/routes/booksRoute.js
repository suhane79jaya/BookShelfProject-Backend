import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();
// 05-Save a new book with mongoose when book is added by frontend
router.post("/", async (request, response) => {
  try {
    if (
      !request.body.image ||
      !request.body.title ||
      !request.body.author ||
      !request.body.rating ||
      !request.body.review ||
      !request.body.description
    ) {
      return response.status(400).send({
        message: "send all required field title,author,publishYear",
      });
    }
    const newBook = {
      image: request.body.image,
      title: request.body.title,
      author: request.body.author,
      rating: request.body.rating,
      review: request.body.review,
      description: request.body.description,
    };
    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//06-Get all the books from the database
router.get("/", async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json({ count: books.length, data: books });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
//06-Get a book  from the database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
//07-update the book from the DB by id
router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.image ||
      !request.body.title ||
      !request.body.author ||
      !request.body.rating ||
      !request.body.review ||
      !request.body.description
    ) {
      return response.status(400).send({
        message: "send all required field title,author,publishYear",
      });
    }
    const { id } = request.params;
    const book = await Book.findByIdAndUpdate(id, request.body);
    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }
    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
//08-delete a book from the db by id
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }
    return response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
export default router;
