import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const s3Bucket = process.env.S3_BUCKET;

export { s3, s3Bucket };
