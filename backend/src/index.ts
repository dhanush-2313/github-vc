import yargs, { demandCommand } from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/init";
import { addRepo } from "./controllers/add";
import { commitRepo } from "./controllers/commit";
import { pushRepo } from "./controllers/push";
import { pullRepo } from "./controllers/pull";
import { revertRepo } from "./controllers/revert";

yargs(hideBin(process.argv))
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
    commitRepo
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
    revertRepo
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;
