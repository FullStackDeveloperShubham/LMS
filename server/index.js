import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
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
app.use(hpp());
app.use(mongoSanitizer());
app.use("/api", limiter);

// body parser middlware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    status: "Error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// CORS CONFIGURATION
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Origin",
      "device-remeber-token",
    ],
  })
);

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
