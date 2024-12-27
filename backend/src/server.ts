import express from "express";
import yargs, { demandCommand } from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/init";
import { addRepo } from "./controllers/add";

const app = express();
yargs(hideBin(process.argv))
  .command("init", "Initialize a new repo", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repo",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    addRepo
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;

app.listen(3000, () => {});
