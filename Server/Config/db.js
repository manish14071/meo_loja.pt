import mongoose from "mongoose"


const connectDB=async()=>{
    try {
 const connect=await mongoose.connect(process.env.MONGO_URL);
 if(connect){
    console.log(`successfully Connected to MongoDB ` )
 }


        
    } catch (error) {
        console.log(error)
        
        
    }
}

export default connectDB