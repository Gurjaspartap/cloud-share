"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [uid, setUid] = useState<string | null>(null); // use state

  // Only run in browser
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    setUid(storedUid);
  }, []);

  const fetchFiles = async () => {
    if (!uid) return;
    const res = await fetch(`/api/upload-url?uid=${uid}`);
    const data = await res.json();
    setFiles(data.files || []);
  };

  useEffect(() => { fetchFiles(); }, [uid]);

  const handleUpload = async () => {
    if (!file || !uid) return;
    // 1. Get pre-signed URL
    const res = await fetch("/api/upload-url", {
      method: "POST",
      body: JSON.stringify({ uid, filename: file.name }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    // 2. Upload file to S3
    console.log("before upload");
    await fetch(data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": "application/octet-stream" },
    });
    console.log("data uploaded to s3");
    setFile(null);
    fetchFiles(); // refresh list
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Upload your files</h1>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="border p-2"/>
      <button onClick={handleUpload} className="bg-green-500 text-white p-2 m-2">Upload</button>
      <h2 className="text-xl mt-4">Your Files:</h2>
      <ul>
        {files.map(f => (
          <li key={f}><a href={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${f}`} target="_blank" className="text-blue-600 underline">{f.split("/").pop()}</a></li>
        ))}
      </ul>
    </div>
  );
}
