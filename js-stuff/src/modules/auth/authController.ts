
import  express  from "express";

import { login, register, profile } from "./authServices";

const authRouter = express.Router();

authRouter.post("/auth/register",register);

authRouter.post("/auth/login",login);

authRouter.get("/api/auth/me",profile);
