import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitizer from "mongoose-express-sanitizer";
import morgan from "morgan";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// GLOABAL RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many request from this IP , please try later ",
});

// SECURITY  MIDDLEWARES
app.use(helmet());
app.use(mongoSanitizer());
app.use("/api", limiter);

// body parser middlware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    status: "Error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// API ROUTES

// loging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res) => {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} in ${process.env.NODE_ENV}`);
});
