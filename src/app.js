import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// 1. we change the corsOptions object :

// "CORS options object mein hum define karte hain ki kaunse URLs (origins) se frontend par request accept ki jaa sakti hai."

// yeh toh jab humne form bhara , tab data liya

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

app.use(express.json({ limit: "16kb" }));






// 2. jab humare pass URL se data aaye toh usko bhi configure krna h

// urlencoder yaani URL encoding ka use hota hai jab aapko kisi string ko aise format mein convert karna ho jo URLs ke liye safe ho. 


// Is process mein special characters ko percent (%) ke sath hexadecimal value mein convert kiya jata hai.

// extended se hum objects ke andar bhi objects  de paate h

app.use(express.urlencoded({ extended: true, limit: "16kb" }));





// express.static() is used in an Express.js application to serve static files (like HTML, CSS, JS, images, fonts, etc.) from the public directory.

// to store file/images in our server in public folder

app.use(express.static("public"));


// cookieParser :: server se user's browser ke andar ki cookies access kr paye and usko change kr paye ( basically CRUD operations perform kr payein )

// there are some ways to secure cookies in user's browser

app.use(cookieParser());




// routes

import userRouter from "./routes/user.routes.js";

// routes declaration

app.use("/api/v1/users", userRouter);

// http://localhost:8000/api/v1/users/register

export { app };