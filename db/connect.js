const mongoose=require('mongoose');

const connectDB=  async()=> {
 try{
  await mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
    console.log("Connection Successful")

 }
 catch(err){
  console.log (err);
 }
   
}
module.exports=connectDB;