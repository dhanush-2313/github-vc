import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({ region: "eu-north-1" });

export const s3 = new AWS.S3();

export const s3Bucket = process.env.S3_BUCKET;
