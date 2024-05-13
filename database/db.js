import mongoose from "mongoose";

 export const Connection=async(username,password)=>{
  
    const URL=`mongodb+srv://${username}:${password}@cluster0.tlmoskt.mongodb.net/?retryWrites=true&w=majority`;
   // mongodb+srv://CMS123:brubsg05XbhYwMrN@cluster0.tlmoskt.mongodb.net/?retryWrites=true&w=majority
    
    try {
      await mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser:true}) 
      console.log("database of cms connected");
    } catch (error) {
       console.log("error while connecting db",error); 
    }
}