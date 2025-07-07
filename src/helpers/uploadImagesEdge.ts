import { s3 } from "../services/s3BackBlaze";

export default async function uploadImagensEdge(input: File | File[]) {
  const arr = Array.isArray(input) ? input : [input];
  const fileKeys: string[] = [];

  for (const file of arr) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `${Date.now()}-${file.name}`;
    await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME ?? "cmsm-rs",
        Key: `images/${key}`,
        Body: buffer,
        ContentType: file.type,
      })
      .promise();

    fileKeys.push(key);
  }
 
  return { status: 200, fileContents: fileKeys };
}
