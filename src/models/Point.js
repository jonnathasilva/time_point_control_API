import mongoose, { Schema } from "mongoose";

export const Point = mongoose.model(
  "Point",
  new Schema(
    {
      search: { type: String, required: true },
      dateEntry: { type: String, required: true },
      prohibited: { type: String, required: true },
      outputRange: { type: String },
      returnInterval: { type: String },
      exit: { type: String },
      userID: { type: String, required: true },
    },
    { timestamps: true }
  )
);
