HTTP headers are key-value pairs sent between the client (browser/frontend) and the server (backend) in HTTP requests and responses.

for example 

Authorization	::  Used for sending tokens, like Bearer <token>

Content-Type :: 	Tells the server the type of content you're sending (e.g. application/json)

Accept	Tells server what kind of response the client expects (e.g. application/json)

Cookie	Carries cookies stored in the browser


cookie-parser is a middleware in Express.js used to parse cookies from the HTTP request headers and make them easily accessible in req.cookies.


Cookies are key-value pairs stored on the client’s browser.

When a request is made to the server :: those cookies are sent via the Cookie header

cookie-parser reads this header and creates an object from it, accessible as req.cookies.

in earlier express package uses body parser to accept json

multer : file uploading configure krte h


--------------------------------------------------


Middleware :: It sits between the request (from user) and response (from server) and does something useful — like checking if the user is logged in, logging info, modifying the request, etc.


Use cases:

- Logging
- Authentication
- Parsing request bodies
- Handling errors


utilities :: Jab hum backend ya full-stack app bana rahe hote hain aur database se baat karte hain (e.g., MongoDB, PostgreSQL, etc.), toh custom utility functions banana ek achha practice hota hai.


Yeh functions humare code ko modular, reusable aur readable banate hain.


- asyncHandler Utility Function :: Yeh ek wrapper function hai jo try-catch ka kaam simplify karta hai. 

- Higher order function

- ek generalised function bana le  :: jab bhi function iss tarike se execute krna ho , mere method mein function pass krdena main execute krke wapas de dunga



Why This Approach Is Cool?


- Reusability: Common DB logic ek jagah likh do, har baar repeat nahi karna.

- Cleaner Controllers: Controller sirf logic handle karega, DB se kaise baat ho rahi wo nahi.

- Easy Testing: Utility functions ko separately test kiya ja sakta hai.


--------------------------------------------


What is a Class in JavaScript? 

- A class in JavaScript is a blueprint for creating objects. 

- It allows you to define a structure (what data the objects should contain) and behavior (what actions the objects can perform).


- In JavaScript, classes are a part of Object-Oriented Programming (OOP).


// After the handling of API response and API errors

- jab bhi humare pass koi error aaye , toh error API error ke through aise checking krni jaruri hai

- middlewares bhi likhne padenge

