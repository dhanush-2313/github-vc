import express from "express";
import userRouter from "./user.router";
import repoRouter from "./repo.router";
import issueRouter from "./issue.router";

const mainRouter = express.Router();
mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter)

mainRouter.get("/", (req, res) => {
    res.send("Welcome ");
});
export default mainRouter;
