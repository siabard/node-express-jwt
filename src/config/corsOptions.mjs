const whiteList = ["http://localhost:3500", "http://127.0.0.1:5500"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Now allowed by CORS"));
    }
  },
};

export default corsOptions;
