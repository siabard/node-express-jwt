import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import corsOptions from "./config/corsOptions.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import { logger } from "./middleware/logEvent.mjs";
import verifyJWT from "./middleware/verifyJWT.js";

import cookieParser from "cookie-parser";
import employeeRouter from "./routes/api/employee.js";
import authRouter from "./routes/auth.js";
import logoutHandler from "./routes/logout.js";
import refreshRouter from "./routes/refresh.js";
import registerRouter from "./routes/register.js";
import rootRouter from "./routes/root.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const app = express();

app.use(logger);
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
