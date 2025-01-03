import express from "express";
import { issueController } from "../controllers/issueController";

const issueRouter = express.Router();

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssue);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssue);
issueRouter.get("/issue/all", issueController.getAllIsuues);
issueRouter.get("/issue/:id", issueController.getIssueById);

export default issueRouter;



