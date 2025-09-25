import mongoose from "mongoose";
const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // seconds

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // configuration mongoose setting
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log("MONGODB CONNECTED SUCCESSFULLY");
      this.isConnected = true;
    });
    mongoose.connection.on("error", () => {
      console.error("CONNECTION ERROR");
      this.isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MONGODB DISCONNECTED");
      this.isConnected = false;
    });
  }

  async connect() {
    if (!process.env.MONGO_URL) {
      throw new Error("mongodb url is not defined in env file ");
    }
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeOutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    if (process.env.NODE_ENV) {
      mongoose.set("debug", true);
    }

    await mongoose.connect(process.env.MONGO_URL, connectionOptions);
    this.retryCount = 0;
  }
}
