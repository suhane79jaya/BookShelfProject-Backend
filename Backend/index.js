import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";
import postsRoute from "./routes/postRoute.js";
import user from "./routes/user.js";
import cookieParser from "cookie-parser";
//import { UserModel } from "./models/User.js";
//import { Book } from "./models/bookModel.js";
import cors from "cors";
const app = express();

//MiddleWare for parsing a request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//MiddleWare for handling CORS POLICY
app.use(
  cors({
    origin: ["http://localhost:3000", "https://BOOKSELF PROJECT.onrender.com"],
  })
);

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`Welcome to BookShelf Tutorial`);
});
//Using Routes
app.use("/api/v1", postsRoute);
app.use("/api/v1", user);
app.use("/books", booksRoute);
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log(`App connected to database server`);
    app.listen(PORT, () => {
      console.log(`Server App is listening to Port:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
// app.post("/login", (req, res) => {
//   const { name, email, password } = request.body;
//   UserModel.findOne({ email: email }).then((user) => {
//     if (user) {
//       if (user.password === password) {
//         res.json("login successfully");
//       } else {
//         res.json("the password in incorrect!");
//       }
//     } else {
//       res.json("no record existed");
//     }
//   });
// });
//this code is written in controller>user.js
// app.post("/register", (request, response) => {
//   const { name, email, password } = request.body;
//   UserModel.findOne({ email: email })
//     .then((user) => {
//       if (user) {
//         response.json("Already hava an account");
//       } else {
//         UserModel.create({
//           name: name,
//           email: email,
//           password: password,
//         })
//           .then((result) => response.json("Account Created"))
//           .catch((err) => response.json(err));
//       }
//     })
//     .catch((err) => response.json(err));
// });
