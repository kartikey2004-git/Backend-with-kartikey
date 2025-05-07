- Humare pass abhi ek aur tab history page hai , getUserHistory 

- jab history button par click krega tab usko saare videos chahiye 

watchHistory[]

[{},{}] saare ke saare objects daal rhe the video model / documents ke , toh wo bhi dekhenge 

------------------------------------------------

- another advanced complex pipeline and complex data structure with different approach 

   - usko kaise execute krna hai kya process hoga 

  - ye likhne ke baad kuch complex bacha nhi hai and SDE level par kuch pipelines likhenge aur kuch methods likhenge jo hum eventually sikh jayenge ....



- watch history mein video ka 
   
   - thumbnail bhi aa rha hai 
   - aur uska title bhi aa rha hai 
   - views aa rhe hai lekin aisa nhi hai ki bahut jyada info h

- lekin actual mein humare pass information itni nhi hai 


video schema mein

  - videoFile
  - thumbnail
  - title
  - description
  - duration
  - views
  - isPublished
  - owner ye sab hai lekin itni information hai nahi 


- jaise hi humne koi user liya match toh hum kr lenge req.user se _id nikal ke 

- ab watch History kaise leke aayenge ???
  
  - humein ek join krna padega 

     - watchHistory ek array tha jisme mein hum saare videos ki id add kre jaa rhe the

     - toh humein bahut saare id's mil jayenge 

     - toh humein in _ids se bahut saare document mil jayenge 


- watchHistory se jaise main lookup krunga video model ko , toh bahut saare video documents array ke andar aa jayenge and humein mil jayenge



- Interesting baat :: owner bhi toh chahiye ab humein --> owner bhi toh waapas se ek user hai , toh humein ek aur lookup krna padega , toh humein ek lookup krna padega ( nested lookup hoga )


      - ek lookup se humare pass values aa jayengi lekin usko hum change nhi kr skte hai further down


      - isi object video document ke andar owner field ke andar ek aur lookup krna padega ( ek aur join krna padega )


      - humein bahut saare video documents milenge humein iss tarah , toh har ek document mein ek aur join hona chahiye toh nested lookup krna padega


      - nested lookup mein kya hoga owner se jao user ke pass aur uski information jo information humko chahiye  wo leke ayenge and usko populate krlenge  , 
      
      - owner ke andar milega toh user object hi , toh humein kitna chahiye wo hum dekh lenge 




- nested kyu krna padega ? kyuki watch history se jaise hi join krenge toh humein [{},{},{}] Array mein multiple video documents mil jayenge 



- but un documents ke andar owner hoga hi nahi , isliye hum kya krenge jaise hi humein document  mila , further ek aur join krdenge ( nested lookup krlenge ) usi time pe owner field in video document  ko user document se ...


similar situations aati hai baaki project mein , repetion hi hota hai ...

------------------------------------------------


Interviews asked question :: 
  
  - Senior Dev perspective :::

  - req.user._id se kya milega :: ek string milti hai actual mein ye mongoDB ki id nahi hai 

  - mongoDB ki id basically hoti hai 

  - agar actually mein mongoDB ki id chahiye toh humein kya krna padega toh humein pura 
    
    - ObjectId('6814b97af10666d4b3a6b179') ye chahiye hoga
    
  - mongoose ke andar kya hota hai internally , jaise hi humko usko yeh id dete hai , toh behind the scene wo usko convert krdeta hai mongoDB ki objectID mein

------------------------------------------------

GetWatchHistory


```javascript
const getWatchHistory = asyncHandler(async (req, res) => { }
```
- Function Overview

       - Ye ek Express.js route handler hai jo async hai.

       - Ye function asyncHandler ke through chal raha hai, jo async errors ko handle karega

       - asyncHandler ek middleware hai jo async errors ko handle karega (e.g., express-async-handler package se liya gaya hai). Isse try-catch ki zarurat nahi padti.


       - Input: req (request) & res (response).


- Main User collection se data le raha hai, jisme uske watchHistory ke andar video IDs hain.

    -  Fir tu chahta hai:

         - Un video IDs se actual video documents fetch ho jayein.

         - Aur fir har video ke andar jo owner (user) hai, uska basic info bhi fetch ho jaye.

------------------------------------------------

```javascript
const user = await User.aggregate([])
```
   - Mongoose Aggregation use ho rahi hai. Isse hum MongoDB ke complex queries likh sakte hain.

   - User.aggregate([...]) ka matlab hai: Users collection ke upar kuch stages chalenge.


------------------------------------------------

- 1.  Match User
  
```javascript
{
  $match: {
    _id: new mongoose.Types.ObjectId(req.user._id),
  },
},
```

  - $match MongoDB ka filter lagata hai.

  - Ye stage sirf us user ko fetch karega jiska _id match kare req.user._id se (jo authentication ke baad req.user me aata hai).

        - Yeh User document dhoond raha hai jiska _id === req.user._id.



  - Note: mongoose.Types.ObjectId() me convert kiya gaya hai, kyuki _id object type hota hai string nahi.
      
      - new mongoose.Types.ObjectId() isiliye lagaya kyunki aggregation mein _id ko ObjectId banana padta hai (aggregation raw MongoDB pe chalti hai).

    
Ab tak ka result: Ye user document fetch hua hai jo login hai.


Result at this stage ::: 


```javascript
[
  {
    "_id": "6639ad7fb5f4c814be11a2d2",
    "fullName": "Kartikey Bhatnagar",
    "username": "kartikeydev",
    "avatar": "kartikey.png",

    // watch history mein videos ki id aa rhi hai 

    "watchHistory": [
      "6640b9f9d4d6f37b78cfae13", // videoId1
      "6640ba0bd4d6f37b78cfae14" //  videoId2
    ]
  }
]
```

- Samjhata hu : Yeh stage sirf authenticated user ka document uthata hai jisme watchHistory me video IDs ka array hai.

------------------------------------------------




- Stage 2: $lookup on videos collection (Populate watchHistory with videos)
    
    - populate matlab to automatically add information to a document 

```javascript
{
  $lookup: {
    from: "videos",
    localField: "watchHistory",
    foreignField: "_id",
    as: "watchHistory", 
  }
}
```

- 
      - watchHistory array me jitne video _id hain, usse Videos collection ke documents la raha hai.

      - Matlab populate kar raha hai videos ko.




- $lookup MongoDB ka JOIN jaisa kaam karta hai.

       - Ye Users collection ko Videos collection se join karega
   
       - localField: "watchHistory" ➔ User document ke watchHistory field se.

       - foreignField: "_id" ➔ Video document ke _id se.

       - Result ko watchHistory array ke andar store karega.


- Iska matlab:

     - User ke document me watchHistory field hai jo ek array of video IDs hai.

     - Ye lookup har ID ko videos collection ke documents se match karke uska data laega


------------------------------------------------




- Step3. Nested Lookup inside Videos (Fetch Owner Info for Each Video )


```javascript
pipeline: [
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",

      pipeline: [
        {
          $project: {
            fullName: 1,
            username: 1,
            avatar: 1,
          },
        },
      ],
    },
  },
```


- Yahan nested pipeline hai:

    - Har video ke andar owner field hota hai (jo user _id hai jisne video upload kiya) usse bhi join kiya jaa raha hai.


    - Ye videos.owner field (jo user _id hai) ko users collection me match karega.

    - Lekin sirf teen fields laega:

      - fullName
      - username
      - avatar
      

Har video ke andar uska owner ka limited info (naam, username, avatar) aayega.



- Step4. Owner Field Ko Single Object Banana

```javascript
{
  $addFields: {
    owner: {
      $first: "$owner",
    },
  },
},
```


- $addFields ek naye field ko add/update karta hai aggregation result me.

- $first: "$owner":

       - Kyuki lookup ke baad owner ek array hota hai (even if sirf ek match mile).

       - Is line me array ka first element uthakar owner field me direct object ki tarah store kar diya jaa raha hai.


     
- owner ab array nahi, ek single object ban gaya (jaise { fullName: '...', username: '...', avatar: '...' }).



```javascript
[
  {
    _id: "userId",
    fullName: "...",
    username: "...",
    avatar: "...",
    watchHistory: [
      {
        _id: "videoId1",
        title: "Video Title 1",
        description: "...",
        owner: {
          _id: "ownerUserId1",
          fullName: "Owner 1",
          username: "owner1",
          avatar: "owner1.jpg"
        }
      },
      {
        _id: "videoId2",
        title: "Video Title 2",
        description: "...",
        owner: {
          _id: "ownerUserId2",
          fullName: "Owner 2",
          username: "owner2",
          avatar: "owner2.jpg"
        }
      }
    ]
  }
]
```

