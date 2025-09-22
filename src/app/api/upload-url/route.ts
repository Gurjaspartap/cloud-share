import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });

export async function POST(req: NextRequest) {
  const { uid, filename } = await req.json();
  if (!uid || !filename) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const key = `users/${uid}/${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME ,
    Key: key,
    ContentType: "application/octet-stream",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return NextResponse.json({ uploadUrl: url });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME ,
    Prefix: `users/${uid}/`,
  });
  const data = await s3.send(command);
  const files = data.Contents?.map(f => f.Key) || [];
  return NextResponse.json({ files });
}
