- [Sample Model link ](https://tiny-ur-lz.vercel.app/modelLink)


- Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It gives structure to your data and helps you interact with MongoDB using JavaScript. 

- An API endpoint is a specific URL path where an API can access the resources it needs. 

- Think of it like different doors to different rooms in a house — each endpoint gives access to a particular piece of data or functionality.

for ex
Method	 Endpoint	      Purpose
GET	     /posts	        Get all blog posts
GET	     /posts/:id	    Get a specific post by ID
POST	   /posts	        Create a new post
PUT	     /posts/:id	    Update an existing post
DELETE	 /posts/:id	    Delete a post

🔹 Components of an API Endpoint:

- Base URL: https://api.example.com
- Path: /posts/123
- Full endpoint: https://api.example.com/posts/123

--------------------------------------------------

🔸 In Development

- Let’s say your frontend sends data to your backend via an API

POST /api/users
{
  "name": "Kartikey",
  "email": "kartikey@example.com",
  "role": "frontend-dev"
}

Each key-value pair in the body is a datapoint that gets stored in MongoDB.


--------------------------------------------------


- Platform on DevUI

- learn to upload videos , images and handles it
- Register and Login page 
- title description , upload thumbnail

- API for search videos , show and display videos , liked and disliked videos and maintain history , tweets section ( like dislike bhi kr skte h )

tokens , bearer tokens , sessions , cookies , passord protection mechanism , emails etc

- Home page
- liked videos page
- history page
- playlist page
- tweets page 
- Video upload page
- admin dashboard ( analytics page )


ORM stands for Object-Relational Mapping.

ORM : It's a programming technique used to interact with a relational database (like MySQL, PostgreSQL, etc.) using object-oriented code instead of writing raw SQL queries.

eraser.io 

- login jo h wo data ka validation ( ki user ne jo username password diya h woh database se same h ya nhi ) or ask about the existing entities and usko validate krta h


firstly properly decide the fields in the register form bcoz if there is any change in fields it changes the flow : data jo user se lena h

konse datapoints liye jayenge and kaise store kiya jayenge


- Modelling of data example / structure od data points

- retreiving and validate krna baad ki cheezein hoti hai


- Prisma is a modern ORM (Object-Relational Mapper) for Node.js and TypeScript. It works with databases like PostgreSQL, MySQL, SQLite, MongoDB (experimental), and makes DB handling 🔥 smooth, typesafe, and intuitive.


- codesanbox
- stackblitz

- cotrollers , routes define krna further and how to connect database...

--------------------------------------------------


- like videos store kiya ja rhe h
- history bhi store ki jaa rhi h


videos ka ek model hoga , users ke andar hum un videos ki id dal de toh history create kr skte h

- refreshTokens 
- JWT
- session creation

- file handling
- third party API
- project structure


-------------------------------------------------


- store the images using third party services like AWS , Azure , Cloudinary 

- sabse pehle photos upload krwake user se usko apne server pr rkhte h temporarily , taki user ka connection lose ho user ka , toh alteast server pr photos ya videos ho

- and phir third process se cloudinary pr dal dete h


folder ke andar folder ke andar hai toh usko hum git pr push nhi kr skte h , kyuki git track krta h files , ko toh to avoid this .gitkeeep file banate h aise scenarios mein
( to create empty folder )


environment variables system se liye jaate taaki ye secure rhe 

main file index.js h

server ki file jab bhi change toh humein phirse server ko restart krna hota h , 

--watch latest option in nodejs

nodemon :  It automatically restarts your server whenever it detects file changes in your project

devDependencies wo dependenies hoti jo hum development ke dauran use krte hai usko production mein nhi le jaate h


environment variables jo hote h na and jo module unka thoda sa panga chalta h 


mkdir se folder bana skte h command line se

Folder structure : 
 - Controllers
 - DB
 - Middlewares
 - Models
 - Routes
 - utils 


- What Controllers Do: functionality

- Handle incoming requests (from routes)
- Call the appropriate business logic or model
- Return a response (like JSON, a view, etc.)

- DB : connection logic of database yaha rkha jaata h

- middleware : koi jo code hai usko in between run krana h , server pe jo request aayi hai , jab server uss request ko full fill kre , usse pehle agar hum kuch checking lagane chahte wha pr middlewares ka kaam ata h


Middleware is a function that sits between the request and the final handling of that request. It can manipulate the request, response, or even end the request-response cycle.


jaise maan lo ki humare pass request aayi  aur hum server se kuch information puch rhe h and hum ek middlware laga denge bich mein ki aap humein apni cookies do , jisse humein pata lage , are u eligible for getting that information or not?


What Are Cookies?

Cookies are small pieces of data stored on the client (browser) by the server


- Authentication (e.g., storing session tokens)
- Remembering preferences (e.g., dark mode)
- Tracking (e.g., analytics, user behavior)

utils (for utilities like file uploading , or sending mails , tokens lena dena )


- Prettier is an opinionated code formatter that supports many languages (like JavaScript, TypeScript, HTML, CSS, etc.). 

- It helps keep your code clean and consistent by automatically formatting it according to a set of rules.

This looks like a Prettier configuration file, most likely named .prettierrc

The .prettierignore file is used to tell Prettier which files or directories it should ignore when formatting your code.


now further we have to learn
- API handling
- error handling
- API response

further we learn concept of modular and reusable code in backend

