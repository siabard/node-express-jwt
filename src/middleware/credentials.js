import allowedOrigin from "../config/allowedOrigins.js";

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigin.includes(origin)) {
    req.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export default credentials;
