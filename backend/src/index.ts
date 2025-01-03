import yargs, { demandCommand } from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/commands/init";
import { addRepo } from "./controllers/commands/add";
import { commitRepo } from "./controllers/commands/commit";
import { pushRepo } from "./controllers/commands/push";
import { pullRepo } from "./controllers/commands/pull";
import { revertRepo } from "./controllers/commands/revert";
import mainRouter from "./routes/main.router";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";


const startServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors({ origin: "*" }));
  app.use("/", mainRouter);
  app.use(express.json());

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  })

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      user = userId;
      console.log("===");
      console.log(user);
      console.log("===");
      socket.join(user);
    })
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })


}

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialize a new repo", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file as string);
    }
  )
  .command(
    "commit message",
    "commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "commit message",
        type: "string",
      });
    },
    (argv) => commitRepo(argv.message as string)
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitId>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => revertRepo(argv.commitId as string)
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;

