import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "HOSPITAL_PROTOTYPE"
    })
    .then(()=>{
        console.log("Connected to database!");
    })
    .catch((err)=>{
        console.log(`Some error occured wwhile connecting to database: ${err}`);
    })
}