// server.js
import { createServer } from "./server-instance.js";
import { db } from "./models/db.js";
import dotenv from "dotenv";

dotenv.config();

async function init() {
  db.init("mongo"); // ✅ now only called here
  const server = await createServer();
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();
