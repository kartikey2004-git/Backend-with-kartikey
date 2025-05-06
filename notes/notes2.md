Bloatware refers to software that comes pre-installed on a device (like a PC, laptop, or smartphone) that you didn’t ask for and often don’t need.

It usually takes up storage, runs in the background, and can slow down your system.

Database connection on production level

ways hum kis kis tatike se database connection kr skte h , what problem we faced and how to handle them

mongoDB database
we can install mongodb by docker or full fledged but here we use mongoDB atlas ( online database)

MongoDB Atlas is the cloud version of MongoDB, fully managed by the MongoDB team. You don’t need to install MongoDB locally — just create a cluster online and connect from your app.

accounts mongoDB atlas ke kayi phases se st ho skte h

- by a project
- kayi baar clusters banane padte h
- kayi baar deployments banane padte h

mongoDB atlas mein provider AWS hota h

ab mongoDB behind the scenes jaa rha h AWS ke paas aur humara database waha pe pure jitne iske softwares h , jo requirement h , connection strings jo banani h wo saari automatically create krdega ......

A connection string is a string that specifies information needed to connect to a database or a service like

- MongoDB (with Mongoose or Node.js)
- PostgreSQL
- MySQL
- Supabase
- Firebase (uses config object instead of string)

connection string works on both

From local environment (e.g., from your laptop using Node.js, Python, etc.)

From cloud environment (e.g., from a deployed app on Vercel, Netlify, etc.)

An IP address (Internet Protocol address) is a unique string of numbers (and sometimes letters, in IPv6) that identifies a device on a network.

What is a Network Router?

- A router is a device that connects multiple networks together

- It decides where your data goes
- Makes sure it reaches the right device
- Helps multiple devices share one internet connection

IP address 0.0.0.0/0

jaise hi humara router change hota hai IP address bhi change hojayega

- network access
- database access

mongoDB mein atlas se enter krne ke liye do cheezein chahiye

- IP address allow hona chaiye
- correct id password hona chahiye
- url hona chahiye ( connection string )

sirf ek IP address add kiya jata h ek machine ka jaha pr aapka backend ka saara code likha h

ho skta AWS ke koi machine ho , digital ocean ki machine chalayi ho

- production grade settings mein hum kabhi bhi allow access from anywhere nhi krte h

testing ke liye temporarily IP allow krdete h

- stackoverflow ref : ki agar humare db ki password mein special characters hote hai toh issues aajate h

------------------------------------------------

Database connection do major tarike se ho skta h :
do approach

- 1. sabse pehle hum index.js ko execute krane wale h nodemon ke through toh hum saara code index.js file mein rkh de

jaise hi index file load hogi , toh wo database connection ka code execute hojayega

- 2. DB naam ka folder banaye and connection ka jo bhi function h usme likhu or phir usko apni index.js file mein import krake execute kraye...

app hogi express ke through for routing
db connection through mongoose

dotenv : dotenv is a zero-dependency module that loads environment variables from a .env file into process.env (in Node.js environments).

- To keep secrets/configs out of your code, like API keys, database URLs, etc.
- To manage environment-specific variables (dev, staging, production).

Express.js:
A minimalist web framework for Node.js used to build server-side applications and APIs.

Mongoose:
An ODM (Object Data Modeling) library for MongoDB and Node.js. It provides a schema-based solution to model application data.

🔗 How They Work Together

- Express handles HTTP requests (routes, middleware, etc.).
- Mongoose handles interaction with the MongoDB database using models and schemas.

---

- database connection through mongoose

- database se jab bhi hum baat krne ka try krenge toh problem aa skti h ( always wrap in try-catch block ya phir promises (resolve-reject) )

- database is always in other continent ( time lagta database se baat krte samay ) toh async await toh lagana hi padega

concept of javascript

- IIFE stands for Immediately Invoked Function Expression.

- It’s a JavaScript function that runs as soon as it is defined.

🔹 Why Use IIFE?

- Avoid polluting the global scope
  Keeps variables private and safe from other scripts.

- Create a private scope
  Useful when you want temporary variables that don’t leak outside.

- Used in module patterns
  Before ES6 modules, IIFE was a common way to create modular code.

-------------------------------------------

Jab bhi koi asynchronous method complete hota hai ( jaise fetch(), setTimeout(), async function, etc.), toh woh ek Promise return karta hai.

- jab bhi hum express se app banayenge toh do hi cheezon pe kam krenge request and response

- request mein data kab kab kaise aa rha hai uska handling
- response kaise bhejna hai

- Jab URL se koi data aata hai, req.params ka use hota hai us data ko access karne ke liye

how to handle those parameters

- req.body mein alag alag taarike se data aa skta h forms , JSON mein aa skta h...( iske liye humein thodi configuration krni padti hai )

- req.params :: URL path parameters --> /user/:id → /user/123

req.query :: URL query string --> /search?name=kartikey&age=20

req.body :: POST/PUT body data (JSON etc) -->
{ "name": "kartikey", "age": 20 }

there is no need of body parser package in express js nowadays directly inbuilt in express js package...

- kayi baar hum data cookies se bhi lenge

Cookies are small pieces of data (usually in key-value pairs) stored on the client side (your browser) by websites.

They're used for:

- Session management (e.g. login state) / authentication
- Personalization (e.g. dark mode)
- Tracking (e.g. analytics or ads)

- kaise server se securely save ki jati hai cookiesbrowser mein

- cookie parser
- cors ( Cross origin resource sharing )

- Key point : jab bhi hum middleware/configuration krna h , toh most of the times hum app.use krte h

- cookie-parser :: Parses cookies attached to the client request object and makes them accessible via req.cookies

- Allows your backend server to handle requests from different origins (like your frontend running on localhost:3000 and backend on localhost:5000)

- we can further go thrrough the corsOptions object ( from documentation and read about whitelisting )

ye jo humara project h isme data jagah jagah se aane wala backend pr

- url se bhi data ayega
- json se bhi data ayega
- kuch req body mein ayega form wagerah submit krenge
- kuch ka json , ya form ayega

Security practices :: toh we need to handle all this ki we set limit to json , so need to avoid crashing a server

