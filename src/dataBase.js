import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("MongoDB connect"));
