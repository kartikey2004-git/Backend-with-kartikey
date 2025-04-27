data :

  - req.url se bhi aa skta hai
  - form / json se data aa rha hai toh req.body mein mil jayega


- params bhi ek tarika hai frontend se req / data send krne ka 


body se hum 
  - form-data bhi bhej skte hai ( text / file )
  - x-www-form- data bhi bhej skte hai jo urlencoded hai

File bhejne ka option nhi hai


- abhi hum raw data json format mein bhejenge postman se 

- abhi humein uske baad file handling ka  dekhna padega abhi tak file handling ka kuch nhi kiya hai

( directly file handle nhi kr skte hai )


multer middleware ke andar hum sirf storage option ( jaise abhi diskStorage mein krana hai ) provide krte hai jisme file ko upload krana hai 


array ek hi field mein multiple files leta hai multer mein toh woh nhi uski jagah 

fields :: Returns middleware that processes multiple files associated with the given form fields. 


ab hum images bhej payenge and further agar humare multer mein koi dikkat hai toh bhi resolve abhi krenge


User database directly contact kr skta hai kyu ye mongoose ke model se bana hai 



```javascript
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true, because 2 and 4 are even
```

```javascript
fields.some(field => !field || field.trim() === "")
```



- Array.some() method :: Checks if at least one element in an array passes a test (returns true).

     - Go through each field (like fullName, email, etc.)

     - Check if any field is missing (undefined, null, or empty string after trim).

     - If even one field is empty, .some() returns true, and we throw an error.



- .includes() :: This checks if the email includes the @ symbol, which is a minimum basic check for an email format.


- ab user mongoDB ko call krega

- findOne returns the first document that matches the query.

    - This will search in the User collection.

    - It will return one user whose email is "example@email.com".

    - If no user is found, it returns null.


- The $or operator is used to perform a logical OR query, allowing you to check for multiple conditions

- The query will return documents where at least one of the conditions in the $or array is true.


409 :: Duplicate Resource: Trying to create a resource that already exists.



abhi tak req.body mein saara ka saara data aa rha hai but humne routes mein jaake ek middleware add krdiya hai 

middleware req ke andar or fields add krdeta hai jyadatar yahi kaam krta hai


multer humein req.files ka access de deta hai


humare pass jo field aata hai req.files mein usme kaafi properties hoti hai , file format jpg/png ,file size 

path of file mil jayega jo file upload kra hai

multer file ko apne server pe le aaya hai at given destination and file ka original name return krdo


req.files: This is an object that contains the uploaded files. In this case, it's assumed that the files are being uploaded with a field named avatar


avatar: This refers to a field in req.files. If you're using something like Multer, 

req.files would be an object where the keys are the names of the fields from the form, and the values are arrays of files uploaded under each field.


req.files.avatar is an array (because multiple files can be uploaded under the same field), this accesses the first file in the array ([0]).


path: This accesses the path property of the first file object in the array. Typically, Multer attaches the path where the file is stored on the server.


ab ye localpath ho bhi skte hai nhi bhi , humare pass avatar wali image toh honi hi chahiye


upload them to cloudinary , avatar and humein yaha se response mein URL mil jayega


database user create krne mein potentially error il skta hai , time lagta hai and database another continent mein

mongoDB har ek entry / user ke sath ek id generate krta hai unique for each user ( _id )


check for user creation and by select method se do field ke alawa saare field ayenge but ye do field nhi ayenge kyuki humne field se pehle - laga diya hai


remove password and refresh token field from response

