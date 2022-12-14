import { Router } from "express";
import { Point } from "../models/Point.js";
import { getByToken } from "../helpers/getToken.js";
import { getUserByToken } from "../helpers/getUserByToken.js";
import { getDate } from "../helpers/getDate.js";

export const routerPoint = Router();

routerPoint.get("/point", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);

  const myPoints = await Point.find({ userID: user._id }).sort({
    dateEntry: -1,
  });

  return res.status(200).json(myPoints);
});

routerPoint.get("/search", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);

  const { month } = req.query;

  const point = await Point.find({ userID: user._id, search: month }).sort({
    dateEntry: -1,
  });

  return res.status(200).json(point);
});

routerPoint.post("/createpoint", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);
  const { date, time, findDateByUser, month } = await getDate(user);

  const year = date.split("/")[2];

  if (findDateByUser) {
    return res.status(406).json({ message: "Ponto desse dia já foi criado!" });
  }

  try {
    const newPoint = await Point.create({
      search: `${month} de ${year}`,
      dateEntry: date,
      prohibited: time,
      userID: user._id,
    });

    return res.status(200).json(newPoint);
  } catch (error) {
    return res.status(401).json({ message: "token invalida" });
  }
});

routerPoint.patch("/piontoutputRange", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);
  const { time, findDateByUser } = await getDate(user);

  if (findDateByUser?.outputRange) {
    return res.status(406).json({ message: "Ponto intervalo já criado!" });
  }

  try {
    const update = await Point.findByIdAndUpdate(findDateByUser?._id, {
      outputRange: time,
    });

    return res.status(200).json(update);
  } catch (error) {
    return res.status(401).json({ message: "token invalida" });
  }
});

routerPoint.patch("/piontreturnInterval", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);
  const { time, findDateByUser } = await getDate(user);

  if (findDateByUser?.returnInterval) {
    return res
      .status(429)
      .json({ message: "Ponto retorno do intervalo já criado!" });
  }

  const update = await Point.findByIdAndUpdate(findDateByUser?._id, {
    returnInterval: time,
  });

  return res.status(200).json(update);
});

routerPoint.patch("/piontexit", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);
  const { time, findDateByUser } = await getDate(user);

  if (findDateByUser?.exit) {
    return res.status(429).json({ message: "Ponto de saída já criado!" });
  }

  const update = await Point.findByIdAndUpdate(findDateByUser?._id, {
    exit: time,
  });

  return res.status(200).json(update);
});
