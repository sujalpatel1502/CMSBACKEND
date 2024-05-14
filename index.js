import express,{json} from "express";

// import DefaultData from './default.js';
import dotev from "dotenv";
// import router from './routes/route.js';
import cors from "cors";
import bodyParser from "body-parser";
import { Connection } from "./database/db.js";
import router from "./routes/route.js";
import multer from "multer";
import admin from 'firebase-admin'
import {getMessaging} from "firebase-admin/messaging"
import { applicationDefault,initializeApp } from "firebase-admin/app";
import {serviceAccount} from './cmsapp-e2b3f-firebase-adminsdk-28gqd-bb9d7ae36b.js'
import cron from "node-cron"
import { sendNotification } from "./controllers/Notification.js";
dotev.config();


const cred=process.env.GOOGLE_APPLICATION_CREDENTIALS

initializeApp({
  credential:admin.credential.cert(serviceAccount),
  projectId:'cmsapp-e2b3f'
})

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse multipart/form-data bodies
app.use(upload.single("image"));
app.use(cors());
app.use(express.json())
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);
const data={
  "fcmTokens": ["dOEY37IHTkaec53AV1seJ_:APA91bEe1qSclb8p1bq_MxY4XzO7nmmvai580J05kaJ5siGr2sUqVHPkNERG6HZ-L1uRW_9BWsGGmblUkg4htiE1SnsfhLQerb4rX3rZDZxjJfAUv6e-7xt4fVZScvbifmaSIYpamhg3","dy1QS_m1Sh6jsn1rr4w3Eh:APA91bG7oLKhU7Y0p5LoRfTSc4PRXsNuuwyhbBmywbn2VXt62-Y_FDavXJ7CYyezWCFmlYhfOkyniZl9yrE7Ojo_1Nq98etkCmcQTD_kyT86IRAp_pQywXScvCQTZ3zQm94nonHLoJc8"],
  "notification": {
    "title": "Hello from server",
    "body": "Testingggggg"
  }
}
// console.log(data.fcmTokens);
app.post("/sendNotification",function(req,res){
  // console.log("req",data.fcmTokens);
  if (!data.fcmTokens || !Array.isArray(data.fcmTokens) || data.fcmTokens.length === 0) {
    return res.status(400).json({ message: "Invalid or empty FCM tokens provided" });
  }
  const recToken=req.body.fcmToken
  const message={
    notification:{
      title:data.notification.title,
      body:data.notification.body
    },
    // dOEY37IHTkaec53AV1seJ_:APA91bEe1qSclb8p1bq_MxY4XzO7nmmvai580J05kaJ5siGr2sUqVHPkNERG6HZ-L1uRW_9BWsGGmblUkg4htiE1SnsfhLQerb4rX3rZDZxjJfAUv6e-7xt4fVZScvbifmaSIYpamhg3
    // token:"dy1QS_m1Sh6jsn1rr4w3Eh:APA91bG7oLKhU7Y0p5LoRfTSc4PRXsNuuwyhbBmywbn2VXt62-Y_FDavXJ7CYyezWCFmlYhfOkyniZl9yrE7Ojo_1Nq98etkCmcQTD_kyT86IRAp_pQywXScvCQTZ3zQm94nonHLoJc8"
  tokens:data.fcmTokens
  }
  getMessaging().sendMulticast(message)
    .then((response) => {
      res.status(200).json({ message: "Notifications sent successfully", response });
    })
  .catch((error)=>{
    res.status(400);
    res.send(error)
    console.log("message error",error);
  })
  
})
const PORT = process.env.PORT;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);


cron.schedule('* * * * *', () => {
 console.log("cameeeee");
 sendNotification(data)
});

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.listen(PORT, (req, res) => {
  console.log(`server in running on port ${PORT}`);
});

// DefaultData();
