import allowedOrigin from "./allowedOrigins.js";

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Now allowed by CORS"));
    }
  },
};

export default corsOptions;
