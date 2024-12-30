import { promises as fs } from "fs";
import path from "path";

export const addRepo = async (filePath: string) => {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const stagingPath = path.join(repoPath, "staging");
  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`Added ${fileName} to staging area`);
  } catch (error) {
    console.error("Error adding repo", error);
  }
};
