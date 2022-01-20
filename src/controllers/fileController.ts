import { Storage } from "@google-cloud/storage";
import multer from "multer";
import { format } from "util";

const storage = new Storage({
  projectId: "gpa-elavator",
  keyFilename: "firebase.json",
});
const bucket = storage.bucket("gs://dev-safaris.appspot.com");
const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

export const uploadFile = multerConfig.single("file");
export const uploadFiles = multerConfig.array("images");

export const uploadImageToStorage = (file: any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    try {
      let newFileName = `${Date.now()}_${file.originalname}`;

      let fileUpload = bucket.file(newFileName);

      const blobStream = fileUpload.createWriteStream({
        resumable: false,
        public: true,
      });

      blobStream.on("error", error => {
        console.log("error is", error);

        reject("Something is wrong! Unable to upload at the moment.");
      });

      blobStream.on("finish", () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(
          `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
        );
        resolve(url);
      });

      blobStream.end(file.buffer);
    } catch (err) {}
  });
};
