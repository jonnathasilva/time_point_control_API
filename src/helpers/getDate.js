import { Point } from "../models/Point.js";

export const getDate = async (user) => {
  const [date, time] = new Date(Date.now()).toLocaleString().split(" ");
  const month = new Date(Date.now()).toLocaleString("default", {
    month: "long",
  });

  const findDateByUser = await Point.findOne({
    dateEntry: date,
    userID: user._id,
  });

  return { date, time, findDateByUser, month };
};
