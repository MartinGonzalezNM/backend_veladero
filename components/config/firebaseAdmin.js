import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./g-pets-firebase-adminsdk-tyn74-2547e1a067.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "g-pets.appspot.com",
});

const bucket = getStorage().bucket();
export default bucket;
