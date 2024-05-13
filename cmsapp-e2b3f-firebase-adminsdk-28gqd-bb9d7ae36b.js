import dotev from "dotenv";

dotev.config();

console.log("==>",process.env.PRIVATE_KEY_ID);

export const serviceAccount={
  "type": "service_account",
  "project_id": "cmsapp-e2b3f",
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  // "private_key":process.env.PRIVATE_KEY,
  "client_email": "firebase-adminsdk-28gqd@cmsapp-e2b3f.iam.gserviceaccount.com",
  "client_id": "118175558912419809736",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-28gqd%40cmsapp-e2b3f.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
