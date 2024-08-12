import mongoose from "mongoose"


const connectDB=async()=>{
    try {
 const connect=await mongoose.connect("mongodb+srv://Mern1:Mern1@mern1.0bxqee7.mongodb.net/Data");
 if(connect){
    console.log(`successfully Connected to MongoDB ` )
 }


        
    } catch (error) {
        console.log(error)
        
        
    }
}

export default connectDB