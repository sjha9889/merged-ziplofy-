import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";
import { authorize, protect } from "../middlewares/auth.middleware";
import { RoleType } from "../types";



export const userRouter = Router();

userRouter.use(protect,authorize(RoleType.SUPER_ADMIN))

userRouter.get("/",getUsers)
userRouter.get("/:id",getUser)

userRouter.post("/",createUser)

userRouter.put("/:id",updateUser)

userRouter.delete("/:id",deleteUser)