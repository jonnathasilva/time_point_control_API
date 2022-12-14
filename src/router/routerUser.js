import { Router } from "express";
import { User } from "../models/User.js";

import { getByToken } from "../helpers/getToken.js";
import { getUserByToken } from "../helpers/getUserByToken.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
export const routerUser = Router();

routerUser.get("/login", async (req, res) => {
  const [, token] = req.headers.authorization.split(" ");
  const [email, plainTextpassword] = Buffer.from(token, "base64")
    .toString()
    .split(":");

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ message: "Usuario não foi encontrado!" });
  }

  const passwordMatch = bcrypt.compareSync(plainTextpassword, user.password);

  if (!passwordMatch) {
    return res.status(422).json({ message: "Senha invalida!" });
  }

  const accessToken = jwt.sign(
    {
      sub: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    name: user.name,
    email: user.email,
    accessToken,
  });
});

routerUser.get("/auth", async (req, res) => {
  const token = await getByToken(req);
  const user = await getUserByToken(token, res);

  return res.status(200);
});

routerUser.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await User.findOne({
    email,
  });

  if (!name || name === " ") {
    return res.status(422).json({ message: "Nome é obrigatório" });
  }

  if (!email || email === " ") {
    return res.status(422).json({ message: "E-mail é obrigatório" });
  }

  if (!password || password === " ") {
    return res.status(422).json({ message: "Senha é obrigatória" });
  }

  if (findUser) {
    return res.status(422).json({ message: "E-mail já estar em uso" });
  }

  const saltRounds = 10;
  const passwordEncrypted = bcrypt.hashSync(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: passwordEncrypted,
  });

  const accessToken = jwt.sign(
    {
      sub: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    name: user.name,
    email: user.email,
    accessToken,
  });
});
