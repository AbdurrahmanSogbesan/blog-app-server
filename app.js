const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

// Multer setup
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(error, destination)
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // cb(error, destination)
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.4uhxiz2.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;

// Parses incoming JSON data
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// Serving images statically
app.use("/images", express.static(path.join(__dirname, "images")));

// For preventing CORS error, seting appropriate CORS headers
app.use((req, res, next) => {
  // Urls that should be able to access the API
  res.setHeader("Access-Control-Allow-Origin", "*");
  // HTTP methods the origin should be allowed to use
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS ,GET ,POST ,PUT, PATCH, DELETE"
  );
  // Headers the origin should be allowed to use
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT || 8080);
    // Socket.io setup - its a websocket
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client conneccted!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
