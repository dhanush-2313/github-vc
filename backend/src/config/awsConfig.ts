import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
console.log("S3_BUCKET:", process.env.S3_BUCKET);

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const s3Bucket = process.env.S3_BUCKET;

export { s3, s3Bucket };
