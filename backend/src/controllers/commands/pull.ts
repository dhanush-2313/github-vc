import { promises as fs } from "fs";
import path from "path";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Bucket } from "../../config/awsConfig";

export const pullRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitsPath = path.join(repoPath, "commits");
  try {
    if (!s3Bucket) {
      throw new Error("s3Bucket is not defined");
    }
    const listCommand = new ListObjectsV2Command({
      Bucket: s3Bucket,
      Prefix: "commits/",
    });
    const data = await s3Client.send(listCommand);

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
      const getCommand = new GetObjectCommand({
        Bucket: s3Bucket,
        Key: key,
      });
      const fileContent = await s3Client.send(getCommand);
      if (fileContent.Body) {
        const body = await streamToBuffer(fileContent.Body as unknown as Readable);
        await fs.writeFile(path.join(repoPath, key), body);
      }
    }
    console.log("Repo pulled successfully");
  } catch (error) {
    console.error("Error pulling repo", error);
  }
};

import { Readable } from "stream";

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
