import express from "express";
import { userController } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.get("/user/:userId", userController.getUser);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.put("/updateUser/:userId", userController.updateUser);
userRouter.delete("/deleteUser/:userId", userController.deleteUser);


export default userRouter;