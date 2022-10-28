import mongoose, { Schema } from "mongoose";

export const User = mongoose.model(
  "User",
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })
);
