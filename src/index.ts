import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/router";
import { corsOptions } from "./utils";
import { startCron } from "./controllers/jobs";

startCron();

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

type Nominee = {
  nominee_name: string;
  email: string;
  phone: string;
  reason: string;
  img_url: string;
  category: string;
};

type Nomination = {
  nominee: Nominee;
  created_by: string;
};

type Category = {
  name: string;
  description: string;
  nominees: Nomination[];
};

type Schedules = {
  start_date: Date;
  end_date: Date;
};

type Event = {
  id: string;
  name: string;
  description: string;
  img_url: string;
  is_completed: boolean;
  nomination_period: Schedules;
  voting_period: Schedules;
  categories: Category[];
  userId: string
};
