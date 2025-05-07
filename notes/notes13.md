MongoDB is a NoSQL database that uses a document-based data model

- NoSQL databases are non-relational, meaning they don't store data in structured tables like relational databases. 

- They offer flexibility in data models and are designed for scalability, high availability, and fast read/write speeds. 

- Examples include document-oriented databases like MongoDB, key-value stores like Redis, and graph databases like Neo4

-----------------------------------------------

__v is Mongoose Version Key which will user object get while registering the user 

   
   - Ye Mongoose ka automatic field hai jo document version ko track karta hai.

   - Iska kaam mainly concurrent ( existing ) updates me hota hai. Jab document update hota hai, to __v increment hota hai.

   - Pehli bar document banega to __v: 0 rahega.

   - Example: Jab tu user ko update karega to __v badh kar 1, 2, 3... hote jayega.


   - Tension lene ki zarurat nahi — ye Mongoose ka internal version key hai, koi sensitive ya important field nahi hai.

-----------------------------------------------

now we have to make user controller jo humein user ki profile waapas laake de - getUser Channel profile

Channel profile mein hai kya kya hai :
   
   - coverImage hai
   - profile Image/avatar hai
   - user ka fullName hai
   - user ka username hai

   hum user ko response mein bhej skte hai 


Two problems ::: 

user --->  let's say for now HiteshChaudhary 

   - lekin humare pass do cheezein nhi hai 
   
      - ki us user ( HiteshChaudhary ) ne kitne channel ko subscribe kr rkha hai :: subscribedTo ka count

     
      - kitne logo ne us user ( HiteshChaudhary ) channel ko subscribe kr rkha hai :: No of subscribers ka count


   - jab bhi hum kisi ke channel ( HiteshChaudhary ) ke page pr aate hai toh humein button dikhta subscribed ki 
   
   - us channel ko humne subscribe kr rkha hai ya nhi ?
   
----------------------------------------------------


- In the database model, consider the user we have taken and Here we have created a different model with the subscription name


- In this case, in the user model, we can create an array with the subscribers name and push all the ids inside it, 


- but the channel has millions of subscribers (very large data), so if we had to make some changes, it would be an issue in processing


- If the first user unsubscribes, the entire data structure has to be re-arranged, which would be a very expensive operation from a data structure perspective...

----------------------------------------------------
        
- Now the point is that to count the subscribers in the channel profile, we have designed a structure/model in the database  who take the subscriptions, which has two fields.
   
   - subscriber 
   - channel


- Basically we have to understand why these models are different

- when we retrieve data from this model (basically perform a join operation), then how will we get the data from it,

   - Let's first understand what this data is right now
   - How to bring the data

------------------------------------------------

Schema mein do cheezein hai subscriber and channel , hai toh dono user hi hai



- jaise koi youtube channel ( HiteshChaudhary ) hai woh bhi user hi hai and humare jo account hai wo bhi channel hi hai but hum waha pr videos nhi dalte hai internally dekha jaaye toh wo user bhi hai 



- subscriber aur channel dono entities actually user hi hai, bas unka role ya context alag hai.


- Toh schema mein subscriber - bhi ek user hi hai and channel jiska hai wo bhi user hi hai

 
    - User: Ye base entity hai, jisme common details hongi jaise userId, name, email, profilePic, etc.


    - Channel: Ye bhi user hi hai, but channel ka role thoda extend hota hai, 
         
         -  jaise ki uske paas videos, subscribers list hoti hai. 

         - Har user apne account se channel create kar sakta hai ya default channel hi hota hai.


   - Subscriber: Ye ek relationship hai — jo bataata hai ki ek user (subscriber) dusre user (channel) ko follow kar raha hai.


- subscriberId aur channelId dono userId hi hai, bas ek subscriber ke role me hai aur ek channel ke role me.



  - Har channel ek user account ke through managed hota hai.

  - Har subscriber bhi user hi hai, jo subscribe karta hai dusre user ke channel ko.

-----------------------------------------------


- ab humne do fields hi kyu rkha subscriber channel array kyu nhi in subscription schema and array nhi toh yeh schema kaam kaise krega 


What is Lookup, Aggregation Pipeline and how to use it , we will discuss about them further


- [Link to Excalidraw for understanding Schema](https://tiny-ur-lz.vercel.app/Excalidraw2)



-----------------------------------------------


- MongoDB aggregation pipelines ::  Series on Aggregation pipelines on hitesh chaudhary pe available if gain more knowledge then hum padh skte hain

  - ab hum basically join krenge subscriptions ko users ke andar ( issi ko bola jaata hai left join )

  - basically join ka ye matlab hai subscriptions se jitni information milti hai usko join krdo users ke andar


- Aggregation pipeline kuch nhi stages hoti hai ek stage -->  dusri stage --> teesri stage 
 
    - each stage performs an operation on the input documents 
  
    - documents that are output from a stage are passed to the next stage 

  
  - for example :  jaise maan lijiye jaise hmne ek stage pe filtering laga di ki humein 100 mein se 50 hi document select krke do kisi bhi condition ke basis pe 
  
  - toh next stage ke liye 50 document hi original dataset hai , 50 document pe hi applicable hoga jo hum process krenge ab 




Flow :: stages ka chain hota hai --> har stage input documents pe operation karta hai --> output ko next stage ko pass karta hai


- Basic Aggregation Pipeline Syntax


```javascript
db.users.aggregate([
  // Stage 1 : har object ek stage hota hai
  {
    // operation yahan likhte hain
  },
  // Stage 2
  {
  },
  // Stage 3
  {
  }
])
```

-----------------------------------------------

let it be take an example : dummy data of books
containing 

books
   - _id : 1
   - title : "The Batman
   - author_id : 100
   - genre : "Classic"

authors
   - _id : 100
   - name: "Kartik"
   - birth_year: 2004
   

- kisi dusre document author ka _id ( jaise mongoDB mein user document ka bhi _id hoga jab naya document banega  )


- toh ye dusre document mein match krna chahiye and humara dusra document hai authors
and  same _id match hogya hai 


- toh dono ko join kraya jaa skta hai and then join krate hi hai jaha jaha pr author_id : 100 hoga waha waha pr document ki puri information aajayegi


   :::: Ab join kaise kiya jaaye ( books ke andar ) :::

   - toh humare pass mongoDB atlas ( mongoDB client me like studio3t ) mein aggregation likhne ka tarika hai


1. $match:

    - Filters documents based on a condition (similar to find()).

    - Use: Narrow down the data to a subset based on criteria (e.g., filtering by date or category).


2. $lookup:

   - Performs a left outer join to another collection (document) .

   - Use: Combine data from different collections (e.g., joining order data with customer details).

```javascript

   [
      {
         $lookup: {
            from : "authors"
            localField: "author_id"
            foreignField: _id , 
            as : "test" 
         }
      }
   ]

```

- from : "authors" ::: collection ( konsa document join krna hai books document mein )


- localField: "author_id" ::: is naam se humne books document mein rkh rkha hai , author ka id


- foreignField: _id of author in authors table  ::: The field in the from collection that can be used as a unique identifier in the primary collection. 



- as : "author_details" ::: result Array ka name 


- ab isse hua kya ki humare pass aaya hai author_details naam ka array add on hogya hai books document mein ( jiske andar object aaya hai ) jisme bhi author_id: 100 ( jis author ki _id : 100 hai ) uska saara data aagya hai



ab jo new document hai wo kuch aisa banega 

   author_details: Array() jiske andar object hai and object ke andar information ha author ki and baaki information toh hai document Books ki


- Document Structure :::

```javascript
   [
      {
        _id: 100
        name: "Kartik"
        birth_year: 2004
      }
   ]
    _id : 1
    title : "The Batman
    author_id : 100
    genre : "Classic"

```
       
Note :: we have strong command on concepts Data structures ki return value konse data structure mein aa rhi hai 


- We can manipulate this data in some ways, sometimes it is kept in the array itself,


- like if we have to ask something further from the array, 
   
   - whether this value is also present inside this array, then we can easily ask , so basically there are operators for that too

-----------------------------------------------

- lekin humein lgta hai ki main inn details ko array mein nhi rkhna chahta hu , 

- toh pure lookup hai uske value ko variable mein store krado ( and humein return milta hai Array ( author_details ) lookup ke baad )

- then Array ka first index 0 return krdenge 


-----------------------------------------------

but hum second pipelines bhi likh skte hai 

```javascript
[
      {
         $lookup: {
            from : "authors"
            localField: "author_id"
            foreignField: _id , 
            as : "test" 
         }
      }, // returns array jiske first index par object hai jisme information hai author ki
      {
         $addFields : {
            // perform another operation
            author_details: {

               // $first: "$author_details"

               $arrayElementAt : ["$author_details",0]
            }
         }
      }
   ]
```

- addFields : naye field add krta hai

- field ke peeche $ sign lgate hain
- return karne ke bhi kayi tarike hai



- we can further hum padh bhi skte hai populate , project , toh hum padh skte hai documentation se

- better is ki hum situational basis pr padhe 


- 3. $project ::  

  - Passes along the documents with the requested fields to the next stage in the pipeline. 
 
  - The specified fields can be existing fields from the input documents or newly computed fields.


- kuch nhi krta hai jaise humare documents mein bahut saare fields hai , ab jo jo fields hum bolenge wo hi return krega

----------------------------------------------


ab humein jo user h usme se kaafi saari details chahiye avatar image , cover image , username , full name , email

   - updatedAt ,createdAt, refresh token , password nhi chahiye 



- jab join krake layenge toh naye fields bhi chahiye toh naye fields bhi dalenge hum , 

- abhi evaluate krenge hum and un field se finally calculate hona chahiye ki humare kitne subscribers hai 


-  count the documents jisme channel given channel se match kr rha hai like all documents jisme channel hitesh chaudhary hai ...


- subscribed --> maine kitne channels ko subscribe kr rkha hai toh waha humein dekhenge ki kitne documents hai jinme subscriber mein hu :: count the subscribers 



- hum ye bhi calculation krenge ki loggedIn user ne kisi bhi channel jispr wo gya hai usko subscribe kr rkha hai ya nhi , wrna option aata hai ki subscribe krlo....

------------------------------------------------
 

- Jab bhi hum kisi channel ki profile humein to usually kya krte hai , toh hum uss channel ke URL pe jaate hai 

- req.params ::  This property is an object containing properties mapped to the named route “parameters”.


for example :: https://www.youtube.com/@chaiaurcode

GET /user/tj
console.dir(req.params.name)  // "tj"



9. $addFields:

   - Adds new fields to documents.

   - Use: Add computed fields or modify existing ones without changing the original structure.

- jisse hum ek hi object mein saara data bhej de



10. $project:

    - Reshapes documents by including or excluding fields, adding computed fields, or changing the structure.

    - Use: Modify the output format of the documents (e.g., changing field names, creating new computed fields).

------------------------------------------------

1. $match stage 

- console.log() after $match 

```javascript
{
  $match: {
    username: username?.toLowerCase(),
  }
}
``` 
- You’d get the user document(s) where username matches the input (converted to lowercase).


- ek array milega jisme ek object hoga user ka jiska username , jo username params se mila hai usse match hoga 

```javascript
[
  {
    _id: ObjectId("user123"),
    username: "kartikey",
    fullName: "Kartikey Bhatnagar",
    email: "kartikeybhatnagar@example.com",
    avatar: "avatar-url",
    coverImage: "cover-url"
    // other user fields
  }
]
```


2. First $lookup (subscribers)


```javascript
{
  $lookup: {
    from: "subscriptions",
    localField: "_id",
    foreignField: "channel",
    as: "subscribers",
  }
}
```
- console.log() after first $lookup

- Now each user document will have a new field subscribers which is an array of subscription documents where this user (_id) is the channel.



```javascript
[
  {
    _id: ObjectId("user123"),
    username: "kartikey",
    fullName: "Kartikey Bhatnagar",
    email: "kartikeybhatnagar@example.com",
    avatar: "avatar-url",
    coverImage: "cover-url",
    subscribers: [
      {
        _id: ObjectId("sub1"),
        channel: ObjectId("user123"),
        subscriber: ObjectId("userA"),
      },
      {
        _id: ObjectId("sub2"),
        channel: ObjectId("user123"),
        subscriber: ObjectId("userB"),
      }
    ]
  }
]

```

- So here subscribers field tells who subscribed to this user. (userA and userB are subscribers)


3. Second $lookup (subscribedTo)
  
```javascript
{
  $lookup: {
    from: "subscriptions",
    localField: "_id",
    foreignField: "subscriber",
    as: "subscribedTo",
  }
}
```

- console.log() after second $lookup

  - Now each user document also gets a subscribedTo array — these are the channels that this user is subscribed to.


```javascript
[
  {
    _id: ObjectId("user123"),
    username: "kartikey",
    fullName: "Kartikey Bhatnagar",
    email: "kartikeybhatnagar@example.com",
    avatar: "avatar-url",
    coverImage: "cover-url",
    subscribers: [...],  // same as before
    subscribedTo: [
      {
        _id: ObjectId("sub3"),
        channel: ObjectId("userX"),
        subscriber: ObjectId("user123")
      },
      {
        _id: ObjectId("sub4"),
        channel: ObjectId("userY"),
        subscriber: ObjectId("user123")
      }
    ]
  }
]
```

 - So here subscribedTo field shows this user is subscribed to userX and userY channels


4. $addFields
  


```javascript
{
  $addFields: {
    subscribersCount: { $size: "$subscribers" } 
    // basically subscribers array  ki length find krega size ,
    channelSubscribedToCount: { $size: "$subscribedTo" } 
    // basically subscribedTo array ki length find krega size,

    isSubscribed: {
      $condition: {
        if: { $in: [req.user?._id, "$subscribers.subscriber"] },

        // ye return value hai [ObjectId("userA"), ObjectId("userB")]

        // concept padhna hai ye :: MongoDB allows $subscribers.subscriber because in aggregation dot notation like array.field automatically extracts an array of those fields.

        // MongoDB does this auto-flattening inside aggregation 


        then: true,
        else: false,
      }
    }
  }
}
```

 - if ke andar :: Since subscribers is an array of objects, you cannot access directly with subscribers.subscriber (this would be undefined in normal JS).

- In your pipeline:
   
   - MongoDB allows $subscribers.subscriber because in aggregation dot notation like array.field automatically extracts an array of those fields. So:



console.log() after $addFields 

   - This step calculates:

      - Total subscribers count
      - Total subscriptions count (this user subscribed to others)

      - Boolean isSubscribed to know if the current req.user is among the subscribers of the channel , jis req.params wale username pe wo gaya hai .



```javascript
[
  {
    _id: ObjectId("user123"),
    username: "kartikey",
    fullName: "Kartikey Bhatnagar",
    email: "kartikeybhatnagar@example.com",
    avatar: "avatar-url",
    coverImage: "cover-url",
    subscribers: [...],  // subscribers array
    subscribedTo: [...],  // subscribedTo array
    subscribersCount: 2,  // because 2 in subscribers array
    channelSubscribedToCount: 2,  // because 2 in subscribedTo array
    isSubscribed: true  // if req.user._id is in subscribers.subscriber array
  }
]
```


5. $project

- This finally selects only fields you want to send to client side


```javascript
[
  {
    fullName: "Kartikey Bhatnagar",
    username: "kartikey",
    subscribersCount: 2,
    channelSubscribedToCount: 2,
    isSubscribed: true,
    avatar: "avatar-url",
    coverImage: "cover-url",
    email: "kartikeybhatnagar@example.com"
  }
]
```

Summary :::::

subscribers  ---> Array of people who subscribed to this user (channel).

subscribedTo ----> Array of channels this user has subscribed to.

subscribersCount	---> Total number of subscribers.

channelSubscribedToCount ----> Total number of channels user subscribed to.

isSubscribed  ---> Is the current logged in user subscribed to this user.


------------------------------------------------


 1) MongoDB Aggregation way (your current code)
   
   - MongoDB supports checking like this directly

```javascript
{
  $addFields: {
    isSubscribed: {
      $cond: {
        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
        then: true,
        else: false
      }
    }
  }
}
```

"$subscribers.subscriber" auto-flattens all subscriber IDs: 
   
   result :: ["userA", "userB"]

- Then $in checks if req.user._id is in that list. (  Efficient because DB does this filtering. )


Method 2.  JS Code to check if logged-in user is subscribed:



```javascript
const loggedInUserId = req.user?._id.toString();

const isSubscribed = channel[0].subscribers.some(
  (sub) => sub.subscriber.toString() === loggedInUserId
)

console.log(isSubscribed); // true or false
```



- Example of some ::  It returns true if it finds an element for which the function returns true; otherwise it returns false


```javascript
const array = [1, 2, 3, 4, 5];
const even = (element) => element % 2 === 0;
console.log(array.some(even)); // Expected output: true

```

In sab par article likh skte hai 

- pipeline kya hoti hai wo likh skte hai 
- aggreagtion se humne kya seekha wo likh skte hai 
- match , lookup , add fields ko likh skte hai 
- condition , size , in
