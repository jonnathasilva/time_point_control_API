import express from "express";
import cors from "cors";

import DataBase from "./dataBase.js";
import { routerPoint } from "./router/routerPoint.js";
import { routerUser } from "./router/routerUser.js";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(routerPoint);
app.use(routerUser);
