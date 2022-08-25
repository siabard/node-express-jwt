import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { logger } from "./middleware/logEvent.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import corsOptions from "./config/corsOptions.mjs";

import rootRouter from "./routes/root.js";
import registerRouter from "./routes/register.js";
import authRouter from "./routes/auth.js";
import employeeRouter from "./routes/api/employee.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const app = express();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "..", "/public")));

// routes
app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/employee", employeeRouter);

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
