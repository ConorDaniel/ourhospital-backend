import * as dotenv from "dotenv";
import Mongoose from "mongoose";

dotenv.config();
Mongoose.set("strictQuery", true);

export const db = Mongoose.connection;

export function connectMongo() {
  const dbUrl = process.env.MONGO_URL || process.env.LOCAL_DB;

  console.log(`Connecting to MongoDB at: ${dbUrl}`);
  Mongoose.connect(dbUrl);

  db.on("error", (err) => {
    console.log(`Database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("⚠️  Database disconnected");
  });

  db.once("open", function () {
    console.log(`✅ Connected to database '${this.name}' on host '${this.host}'`);
  });
}
