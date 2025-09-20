import { v4 as uuidv4 } from "uuid";
import bucket from "../config/firebaseAdmin.js";

export const uploadFileToFirebase = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `comprobantes/${uuidv4()}.jpg`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (err) => reject(err));

      blobStream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    } catch (error) {
      reject(error);
    }
  });
};
