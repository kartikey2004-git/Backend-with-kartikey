// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"
import connectDB from "./db/database.js"
import {app} from "./app.js"

// As early as possible in your application, import and configure dotenv

// jitna jaldi humari application load ho , utni jaldi saare environment variable har jagah available hojane chahiye jisse sabko jaldi access mil jaye

dotenv.config({
  path:'./.env'
})

connectDB()
.then(() => {
  // Listen for server errors
  app.on("error", (err) => {
    console.error("Server error:", err);
  });
  
  app.listen(process.env.PORT || 8000,() => {
    console.log(`Server is running at port : ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO db connection failed !!!",err);
})


// common issue DB is not supported resolving ES modules :: proper imports check krlene chahiye ek baar and most of the times extension jaruri hota hai


//  MONGODB connection FAILED MongoServerError: bad auth : authentication failed  :: agar connection string mein ya phir db password se related koi error hai 





/* Another Approach

import express from 'express'
const app = express()

IIFE ( Immediately Invoked Function Expression )

; (async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

    --> listeners in express : error ka event
    ki database toh connect ho gya but humari express ki app baat nhi kr pa rhi ho

    app.on("error",(error) => {
      console.log("not able to talk to database",error);
      throw error
    })

    app.listen(process.env.PORT,() => {
      console.log(`App is listening on port ${process.env.PORT}`);
    })

  } catch (error) {
    console.error("ERROR",error)
    throw error
  }
})() 
  

*/




/* app listeners usually refer to the part where your app starts listening for incoming HTTP requests

In JavaScript:

throw is used to throw a custom error.
The execution stops unless caught using try...catch

on listeners : This is useful for handling custom events or server lifecycle events. 

*/