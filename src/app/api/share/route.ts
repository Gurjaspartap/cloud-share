import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.NEXT_PUBLIC_AWS_REGION });

export async function POST(req: NextRequest) {
  try {
    const { key, expiresInSeconds = 3600 } = await req.json();
    
    if (!key) {
      return NextResponse.json({ error: "Missing file key" }, { status: 400 });
    }

    if (!process.env.S3_BUCKET_NAME) {
      return NextResponse.json({ error: "S3 bucket not configured" }, { status: 500 });
    }

    // Validate expiration time (max 7 days = 604800 seconds)
    const maxExpiration = 604800;
    const expirationTime = Math.min(Math.max(expiresInSeconds, 60), maxExpiration);

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { 
      expiresIn: expirationTime 
    });

    return NextResponse.json({ 
      shareUrl: url,
      expiresIn: expirationTime,
      expiresAt: new Date(Date.now() + expirationTime * 1000).toISOString()
    });

  } catch (error) {
    console.error("Error generating share URL:", error);
    return NextResponse.json({ 
      error: "Failed to generate share URL" 
    }, { status: 500 });
  }
}