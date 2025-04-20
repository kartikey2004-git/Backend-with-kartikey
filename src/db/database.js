import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    )
    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`
    ) 

    // It will be replaced with the actual host MongoDB is connected to, like localhost, 127.0.0.1, or a cluster URI like cluster0.mongodb.net.

    // It is necessary taaki agar galti se production ki jagah hum kisi aur server pr connect hojau toh atleast humein pata rhe ki konse host pe hum connect huye hai

    // databases alag alag hota hai production , development , testing ka

  } catch (error) {
    console.error("MONGODB connection FAILED", error)
    process.exit(1)
  }
}

export default connectDB

// mongoose actual mein humein ek return object deta h , connection hone ke baad jo bhi response aa rha usko hold kr skte hai ...

// process.exit(1) is a Node.js command that forcefully ends the process and signals that it exited with an error.

// jo current nodejs application chal rhi hai ye kisi process pr chal rhi hogi , ye us chiz ka reference hai...

// process.exit() — Terminates the Node.js process.

/* 
Exit Code

0: Success
1: General error (or failure) 

Assignments:

process.exit() ke baare mein padhna hai free time mein

console.log(connectionInstance) krake dekhenge toh humein bahut kuch seekhna ko milega 

*/



