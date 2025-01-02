import fs from "fs";
import path from "path";
import { promisify } from "util";

const readDir = promisify(fs.readdir);
const copyfile = promisify(fs.copyFile);

export const revertRepo = async (commitId: string) => {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  console.log(repoPath);

  const commitsPath = path.join(repoPath, "commits");
  console.log(commitsPath);

  try {
    if (!commitId) {
      throw new Error("commitID is not defined");
    }
    const commitDir = path.join(commitsPath as string, commitId as string);
    console.log(commitDir);

    const files: any = await readDir(commitDir);
    const parentDir = path.resolve(repoPath, "..");
    for (const file of files) {
      await copyfile(path.join(commitDir, file), path.join(parentDir, file));
    }
    console.log("Reverted to commit", commitId);
  } catch (error) {
    console.error("Unable to revert", error);
  }
};
