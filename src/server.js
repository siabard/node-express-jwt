import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import corsOptions from "./config/corsOptions.mjs";
import credentials from "./middleware/credentials.js";
import errorHandler from "./middleware/errorHandler.mjs";
import { logger } from "./middleware/logEvent.mjs";
import verifyJWT from "./middleware/verifyJWT.js";

import cookieParser from "cookie-parser";
import employeeRouter from "./routes/api/employees.js";
import authRouter from "./routes/auth.js";
import logoutHandler from "./routes/logout.js";
import refreshRouter from "./routes/refresh.js";
import registerRouter from "./routes/register.js";
import rootRouter from "./routes/root.js";
import connectDB from "./config/dbConn.js";

dotenv.config();

// connect to db
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const app = express();

app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "..", "/public")));

// routes
app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutHandler);
app.use(verifyJWT);
app.use("/employees", employeeRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "view", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
