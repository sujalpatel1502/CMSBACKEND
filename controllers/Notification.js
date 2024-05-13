import {getMessaging} from "firebase-admin/messaging"

export const sendNotification=async(data)=>{
    console.log("dataaa",data);
    if (!data.fcmTokens || !Array.isArray(data.fcmTokens) || data.fcmTokens.length === 0) {
        // return res.status(400).json({ message: "Invalid or empty FCM tokens provided" });
        console.log("Invalid or empty FCM tokens provided");
      }
      const message={
        notification:{
          title:data.notification.title,
          body:data.notification.body,
        //   icon:"https://firebasestorage.googleapis.com/v0/b/cmsapp-e2b3f.appspot.com/o/images%2Fimage1-1710655092426.jpg?alt=media&token=3bba18c9-308e-4cc9-bcbc-70be9803383e"
        },
        // for sending image with notifications
        // android: {
        //     notification: {
        //       imageUrl: 'https://firebasestorage.googleapis.com/v0/b/cmsapp-e2b3f.appspot.com/o/images%2Fimage1-1710655092426.jpg?alt=media&token=3bba18c9-308e-4cc9-bcbc-70be9803383e'
        //     }
        //   },

        
     
        // dOEY37IHTkaec53AV1seJ_:APA91bEe1qSclb8p1bq_MxY4XzO7nmmvai580J05kaJ5siGr2sUqVHPkNERG6HZ-L1uRW_9BWsGGmblUkg4htiE1SnsfhLQerb4rX3rZDZxjJfAUv6e-7xt4fVZScvbifmaSIYpamhg3
        // token:"dy1QS_m1Sh6jsn1rr4w3Eh:APA91bG7oLKhU7Y0p5LoRfTSc4PRXsNuuwyhbBmywbn2VXt62-Y_FDavXJ7CYyezWCFmlYhfOkyniZl9yrE7Ojo_1Nq98etkCmcQTD_kyT86IRAp_pQywXScvCQTZ3zQm94nonHLoJc8"
      tokens:data.fcmTokens
      }
      getMessaging().sendMulticast(message)
    .then((response) => {
    //   res.status(200).json({ message: "Notifications sent successfully", response });
    console.log("responseee",response);
    return response;
    
    })
  .catch((error)=>{
    // res.status(400);
    // res.send(error)
    return error
    console.log("message error",error);
  })
}