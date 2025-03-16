import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes";
const port = process.env.PORT || 3000;
import "module-alias/register";
import { addAliases } from "module-alias";

//ALIASES
addAliases({
  "@routes": __dirname + "/routes",
  "@controllers": __dirname + "/controllers",
  "@interfaces": __dirname + "/interfaces",
  "@middlewares": __dirname + "/middlewares",
  "@schemas": __dirname + "/schemas",
  "@db": __dirname + "/db",
  "@errors": __dirname + "/errors",
  "@hashmaps": __dirname + "/hashmaps",
  "@helpers": __dirname + "/helpers",
  "@managers": __dirname + "/managers",
  "@services": __dirname + "/services",
  "@utils": __dirname + "/utils",
  "@validations": __dirname + "/validations",
});
//APP INITIALIZATION
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api", router);

//SERVER INITIALIZATION
const server = () => {
  const dbURL = process.env.MONGODB_URL || "";
  mongoose
    .connect(dbURL)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

server();
