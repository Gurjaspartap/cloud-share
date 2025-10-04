import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `users/${uid}/`,
  });
  const data = await s3.send(command);
  
  if (!data.Contents) {
    return NextResponse.json({ files: [] });
  }

  // Process files to include metadata and download URLs
  const files = await Promise.all(
    data.Contents.map(async (file) => {
      const fileName = file.Key?.split('/').pop() || '';
      const fileSize = file.Size || 0;
      const uploadDate = file.LastModified?.toISOString().split('T')[0] || '';
      
      // Generate download URL
      const downloadCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.Key!,
      });
      const downloadUrl = await getSignedUrl(s3, downloadCommand, { expiresIn: 3600 });
      
      // Determine file type
      const fileType = getFileType(fileName);
      
      // Generate thumbnail URL for images
      let thumbnailUrl = null;
      if (fileType === 'image') {
        thumbnailUrl = downloadUrl; // For now, use the same URL as thumbnail
      }
      
      return {
        id: file.Key!,
        name: fileName,
        size: formatFileSize(fileSize),
        type: fileType,
        uploadDate,
        downloadUrl,
        thumbnail: thumbnailUrl,
        key: file.Key!
      };
    })
  );
  
  return NextResponse.json({ files });
}

function getFileType(fileName: string): 'image' | 'video' | 'document' | 'audio' | 'other' {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'ppt', 'pptx', 'xls', 'xlsx'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (documentExtensions.includes(extension)) return 'document';
  return 'other';
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function DELETE(req: NextRequest) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    
    await s3.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
