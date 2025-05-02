# Register the User

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


---------------------------------------------------

1. Postman Collection Kaise Banta Hai?

    - Postman me API requests ko ek Collection ke andar group kiya jata hai.

       - Postman kholen.

       - Left sidebar me Collections tab pe click karein.

       - New Collection pe click karein -> Name dein -> Description optional hai.

       - Ab usme Add Request karein (GET/POST/PUT/DELETE wagairah).

       - Saari requests bana kar collection me save kar sakte hain.

       - Fir collection ko frontend team ke saath Export karke .json file ke roop me share kar sakte hain.

       - Right click collection pe -> Export -> v2.1 format choose karein.


2. Postman Me Variables Kaise Set Hote Hain?

     - Variables Global, Collection level, ya Environment level hote hain.


        - Top bar me Environment dropdown hai -> Manage Environments pe click karein.

        - Naya environment banayein -> Waha key-value ke pair me variables set karein (e.g., baseUrl: https://api.example.com).

        - Request URL me {{baseUrl}}/login is tarah se use kar sakte hain.

        - Collection level variable:

        - Collection pe right click karein -> Edit -> Variables tab me set kar sakte hain.



3. x-www-form-urlencoded me File Nahi Bhej Sakte

    - Bilkul sahi — x-www-form-urlencoded sirf textual data ke liye hai.

    - File bhejni ho to

       - form-data tab use karte hain Postman me.

       - Form-data me Key ko file type set karoge to Postman file input allow karega.



4. Content-Type Check Karne Ka Tarika (Postman me)

    - Postman me aap Headers tab me jaa kar Content-Type manually set kar sakte hain.
       
       - For form-data: multipart/form-data

       - For JSON: application/json

       - For x-www-form-urlencoded: application/x-www-form-urlencoded



5.  Form-Data vs Raw JSON (File Upload ke Mamle me)

  -  Form-data me hum keys/fields + files dono bhej sakte hain.

Jaise:

   - name: Kartikey
   - avatar: <choose file>

❌ Raw JSON me hum sirf textual data bhej sakte hain, file upload nahi possible hota directly.

Kyuki JSON file ko encode nahi kar sakta.


6.  File Name Handling (Frontend vs Cloudinary Response)

  - Jab user frontend se file upload karta hai:

     - File ka original name kuch time tak frontend me rahega.


  - Lekin jab aap file ko Cloudinary ya kisi bhi cloud storage me upload karte hain


      - Wo storage ke liye unique name generate karta hai (e.g., abc12345xyz.jpg)

      - Ye isliye ki globally files clash na ho.

      - Is naam ko frontend ko response me dena chahiye, taaki wo usi URL se use kare.


8. MongoDB ID (BSON ObjectID)

    - MongoDB jab naya document insert karta hai to wo _id field me ek ObjectId deta hai.

    - Ye BSON type ka hota hai


```bash
651f87959d26c8abf8794b11
```

contains : 

  -  Time stamp
  -  Machine ID
  -  Process ID
  -  Incremental counter hota hai.

Ye globally unique hota hai.


---------------------------------------------------


Response jab cloudinary se aata hai 

```bash 
{
  asset_id: '0482c3c7b107c910cabd430320aa6816',
  public_id: 'xkd0thdjesbazcvan3d8',
  version: 1746190968,
  version_id: '2f038a10ed138f8a980c892f7b9b9c25',
  signature: '32593c4c02d80c5352640c5892fab48a41963f5f',
  width: 912,
  height: 273,
  format: 'png',
  resource_type: 'image',
  created_at: '2025-05-02T13:02:48Z',
  tags: [],
  bytes: 89697,
  type: 'upload',
  etag: '4b9718368457eaaf0fde49993878987f',
  placeholder: false,
  url: 'http://res.cloudinary.com/djsszfqfc/image/upload/v1746190968/xkd0thdjesbazcvan3d8.png',
  secure_url: 'https://res.cloudinary.com/djsszfqfc/image/upload/v1746190968/xkd0thdjesbazcvan3d8.png',
  asset_folder: '',
  display_name: 'xkd0thdjesbazcvan3d8',
  original_filename: 'logo',
  api_key: '777424669926297'
}
```


- Response of res.body when we send data from postman

```bash
{
  fieldname: 'avatar',
  originalname: '100+ Hình Nền Máy Tính Full HD, 2K, 4K Đẹp Nhất 2025 (1).jpg',        
  encoding: '7bit',
  mimetype: 'image/jpeg'
}
{
  fieldname: 'coverImage',
  originalname: 'logo.png',
  encoding: '7bit',
  mimetype: 'image/png'
}
[Object: null prototype] {
  fullName: 'hola',
  email: 'lmmao@1345.com',
  password: '12345678667',
  username: 'brofunhhhjjjj'
}

null
```

- Response of req.files jiska access multer deta hai 

```bash

[Object: null prototype] {
  avatar: [
    {
      fieldname: 'avatar',
      originalname: '100+ Hình Nền Máy Tính Full HD, 2K, 4K Đẹp Nhất 2025 (1).jpg',    
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/temp',
      filename: '100+ Hình Nền Máy Tính Full HD, 2K, 4K Đẹp Nhất 2025 (1).jpg',        
      path: 'public\\temp\\100+ Hình Nền Máy Tính Full HD, 2K, 4K Đẹp Nhất 2025 (1).jpg',
      size: 50700
    }
  ],
  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'logo.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './public/temp',
      filename: 'logo.png',
      path: 'public\\temp\\logo.png',
      size: 89697
    }
  ]
}


```

jaise humne agar optional chaining kri hai cover image pr wo hum postman ya frontend se nhi bhej rhe hai toh ERROR : "cannot read properties of undefined "


bss issi tarike se real world applications banti hai and pure backend ko wrap krke deploy krdenge 
production mein 


- cookies refresh token sab maintain hotaa hai 
- set environment variables
- bind in collections for availability 
