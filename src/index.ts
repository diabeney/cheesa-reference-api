import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/router";
import { corsOptions } from "./utils";

const app = express();

dotenv.config();
app.use(json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(router);

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string);
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
  });
})();
