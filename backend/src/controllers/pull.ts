import { promises as fs } from "fs";
import path from "path";
import { s3, s3Bucket } from "../config/awsConfig";

export const pullRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitsPath = path.join(repoPath, "commits");
  try {
    if (!s3Bucket) {
      throw new Error("s3Bucket is not defined");
    }
    const data = await s3
      .listObjectsV2({ Bucket: s3Bucket as string, Prefix: "commits/" })
      .promise();

    const objects = data.Contents;
    for (const object of objects!) {
      const key = object.Key;
      if (!key) {
        continue;
      }
      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop() || ""
      );
      await fs.mkdir(commitDir, { recursive: true });
      const params = {
        Bucket: s3Bucket,
        Key: key,
      };
      const fileContent = await s3.getObject(params).promise();
      if (fileContent.Body) {
        await fs.writeFile(
          path.join(repoPath, key),
          fileContent.Body as Buffer
        );
      }
    }
    console.log("Repo pulled successfully");
  } catch (error) {
    console.error("Error pulling repo", error);
  }
};
