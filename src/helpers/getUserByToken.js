import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const getUserByToken = async (token, res) => {
  if (!token) {
    return res.status(401).json({ message: "Acesso Negado!" });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: payload.sub });

  if (!user) {
    return res.status(422).json({ message: "Usuario não foi encontrado!" });
  }

  return { _id: user._id, name: user.name, email: user.email };
};
