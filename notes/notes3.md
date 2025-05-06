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


------------------------------------------------


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

--------------------------------------------

advanced level ki aggregation pipelines bhi likhenge :: ki kis tarike se production level API likhi jaati hai , iss tarike se database calls hoti hai and ye bahut hi standardised h

- jwt 
- brcypt
- models ( user and video model )

- mongoDB jaise hi user ko save krta hai automatically ek unique id generate krta hai in BSON data not in json data 


- avatar and coverImage hai wo hum upload krenge third party services pe and third party service humein URL dedegi...So database mein humeinn ek string save krna hai url ka


- video file kisi third party service par upload krdenge and wo humko URL dedegi ( AWS , cloudinary )


- sabse pehle user ke andar hum user ki history track kr rhe hai ki user ne kon konse videos dekhe hai


```bash

 watchHistory : [{},{},{},{}]


 let watchHistory = [
  { objectID: "vid123", watchedAt: "2025-04-23T08:12:30Z" },
  { objectID: "vid456", watchedAt: "2025-04-23T07:50:00Z" },
];

```




- videos ki jitni bhi Id hai jaise hi ek video hum dekhenge woh Array ke objects mein  push krte jayenge


- and hum videos mein owner hona jaruri hai kyuki ye bhi pata chale ki kisne upload ki hai video




- index in a schema (especially in Mongoose) is used to create an index on a field in MongoDB. Indexes improve the performance of read operations like .find(), .sort(), etc.


Why use index?

  - Faster searches
  - Efficient sorting
  - Better performance for large collections


- standard practice hai database ke andar jab bhi password likho encrypt krkr likhna hai to avoid leaking DB pass


- Challenge :: par encrypt krke toh nhi rkh skte kyuki at the time of authentication ( compare kaise krenge encrypted string or pass string ko )



- A refresh token is a type of token used in authentication systems to get a new access token without forcing the user to log in again. 




Why Use Refresh Tokens?


- Access tokens (JWTs usually) expire quickly for security.

- Refresh tokens are longer-lived and can be used to get new access tokens.

- This way, users stay logged in without needing to log in repeatedly.




Typical Flow:


1. User logs in → Server sends:

      access_token (short-lived, e.g., 15 mins)
      refresh_token (long-lived, e.g., 7 days or more)

2. Access token is used for APIs.

3. When access token expires:

      Send refresh_token to backend
      Backend verifies it and sends back a new access token


Store refresh_token securely — often in httpOnly cookies to protect from XSS.


- MongoDB allows us to store small images/media files ( not good practice loads on database )


- Cloudinary jaise hi koi file upload krleta hai  , uss ke baad file ki information humein deta hai ( url string , time etc )



-------------------------------------------------


- isPublished video publicy available hai ya nhi :: ek boolean flag hai ::  hum check krlenge ki video bhejna hai ya nhi bhejna hai / show krna hai ya nhi krna hai


watchHistory ek aisa field hai jo project ko kaafi complex  and next level banata hai 

hum basic mongoDB query toh likhenge hi

( 

  insertMany :: Multiple documents ek saath insert karne ke liye:

  updateMany  :: Multiple documents ko ek saath update karne ke liye:

  save wagerah :: Single document insert ya update karne ke liye:
  
)

Pagination is the process of dividing content, especially on the web, into discrete pages


This allows users to browse through a large amount of data in manageable chunks, improving user experience and page loading speed

--------------------------------------------------

What is an Aggregation Pipeline?

Imagine you have a box of documents (data), and you want to:

   - Pick only a few based on a condition ✅
   - Group them together 📦
   - Do some math (like count or sum) ➕
   - Change how the data looks 🔄

To do that, you pass the data through steps — this is called a pipeline.


for example ye data hai humare pass

``` bash 
[
  { "name": "Amit", "age": 22, "city": "Delhi" },
  { "name": "Priya", "age": 30, "city": "Mumbai" },
  { "name": "Raj", "age": 22, "city": "Delhi" }
]

```


Now I want to know:

- “How many users are there from each city?”



Step 1: Group by city

```bash

{ $group: { _id: "$city", total: { $sum: 1 } } }

 This groups people by city and counts them.

```

Output:: 

```bash

[
  { "_id": "Delhi", "total": 2 },
  { "_id": "Mumbai", "total": 1 }
]

```

More Examples (Real World):

Task          	            MongoDB Aggregation

Get only users from Delhi	    $match
Count users by city	          $group
Sort users by age	            $sort
Show only name and city	      $project


```bash

db.users.aggregate([
  { $match: { city: "Delhi" } }, // Only Delhi users
  { $group: { _id: "$age", total: { $sum: 1 } } }, // Group by age
  { $sort: { total: -1 } } // Sort by number of users
])

```

Think of it like:
Filters + Groups + Sorts = Clean and useful data.


--------------------------------------------------


mongoose-aggregate-paginate-v2 is an npm package that adds pagination capabilities to Mongoose's aggregation pipelines..



It's especially useful when you're dealing with complex queries that use Mongoose’s .aggregate() method and need to implement server-side pagination.




How It Works

It wraps the aggregation pipeline and provides a paginated result that includes:


  - docs: the current page's documents
  - totalDocs: total number of documents matching the pipeline
  - limit: number of documents per page
  - page: current page number
  - totalPages: total number of pages
  - hasNextPage / hasPrevPage: navigation flags


mongoose aggregation queries 
- complex queries 
- injected like plugin


mongoose :: ke andar kaafi type ke middlewares likhe ja skte hai

plugins bhi inject kiya ja skte hai

- pre ( data save ho rha hai usse just pehle kuch kro )
- post ( data save ho rha hai uske baad kuch kro )



--------------------------------------------------

brcypt :: core nodejs ki library pe bana hua package hai

bcryptjs :: optimized in plain javascript with zero dependencies 


A hashed string is the output of a hash function, which takes an input (like a password or any text) and returns a fixed-size string of characters, which appears random.

"kartikey123" ---> 0b4d2cfa67cfa97d3bffbb0a707f2ee7

Secure Hash Algorithm : SHA-1 , SHA-256

bcrypt (uses a salt, so output changes each time)




- bcrypt is a JavaScript library that allows you to hash passwords securely using the bcrypt algorithm. It works entirely in JavaScript and is often used in Node.js applications.



Why use it?

- Password hashing: It turns plain-text passwords into hashed strings.

- Security: Bcrypt is resistant to brute-force attacks and is widely trusted.

- Salting: It automatically adds a unique salt to each hash to prevent rainbow table attacks. ( salts ya round provide krte hai at the time of hashing ) 

saltRounds = jitna zyada, utni security (but zyada slow bhi)


passowrd ka encryption and decryption and comparison with brcypt 



--------------------------------------------------

- Authentication is the process of verifying a user's identity before granting them access to a system, resource, or application


- Authorization is the process of giving someone the ability to access a resource


- JWT stands for JSON Web Token


- A JSON web token(JWT) is JSON Object which is used to securely transfer information over the web(between two parties).


- It’s commonly used for authentication and authorization


- JWT is a token-based authentication standard used to securely transmit information between parties as a JSON object. 


It's widely used in APIs, web apps, and microservices.



JWTs are often used for:

  - 🔑 Authentication
  - 🔐 Authorization
  - 🛡️ Information exchange


For example:

- When you log into a website, the server can generate a JWT and send it to your frontend. 

- You then store it (usually in localStorage or cookies) and include it in future requests to access protected routes or resources.




Structure of a JWT
A JWT has three parts, separated by dots (.)


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkthcnRpa2V5IiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c


1. Header :: It contains metadata about the token

```bash
{
  "alg": "HS256", // algorithm used to sign the token
  "typ": "JWT"
}
```

2. Payload :: The actual data or claims you want to send

```bash 

{
  "sub": "1234567890", // subject (usually user id)
  "name": "Kartikey",
  "role": "admin",
  "iat": 1516239022 // issued at
}

```

There are three types of claims:
  - Registered (e.g. iss, exp, iat, sub)    
  - Public (custom, like name, role)
  - Private (agreed between parties)



3. Signature :: Used to verify the token hasn’t been tampered with.

The signature is created by taking the header and payload, and running them through a hashing algorithm (like HMAC SHA256) along with a secret key known only to the server.



-------------------------------------------------

How JWT Works (Flow)

1. User Logs In
   - Sends credentials to server (username/password)

2. Server Creates JWT
  
  - After verification, server sends back a JWT signed with a secret.

3. Frontend Stores JWT
   
  - Usually in localStorage, sessionStorage, or httpOnly cookie

4.  Frontend Sends JWT

  - For each protected API call, JWT is sent in the Authorization header

  ```bash 
  Authorization: Bearer <token> 
  ```

5.  Backend Verifies Token
  - Verifies the token using the same secret key or a public key 
  - If valid → grants access, else → denies request.




Common Use Cases

- Authentication: Know which user is logged in.
- Authorization: Check user roles and permissions.
- Single Sign-On (SSO).
- Stateless sessions — no server-side memory needed for user sessions.



Access tokens are usually short-lived. A refresh token is used to get a new access token without logging in again.

Typical flow:

   - You get accessToken (short-lived) and refreshToken (long-lived).

   - When accessToken expires, the client sends refreshToken to get a new accessToken.


brcypt and brcyptjs both based on the cryptography algorithm 

secret make each token unique

secret in JWT :: The secret is a private string used to sign and verify the JWT

 - It's used in algorithms like HS256 (HMAC SHA-256).

 - Without the correct secret, no one can forge ( to put a lot of effort into making something strong and successful ) or validate the token.

 - It's basically the key to trust.

else koi bhi decrypt kr skta hai , because SHA algorithm  is publicaly available 
