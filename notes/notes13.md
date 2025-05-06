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

   - lekin humare pass do cheezein nhi hai ki user ne kitne channel ko subscribe kr rkha hai 
   
   - kitne logo ne uss channel ko subscribe kr rkha hai

   - jab bhi hum kisi ke page pr aate hai toh humein button dikhta subscribed ki us channel ko humne subscribe kr rkha hai ya nhi


- In the database model, consider the user we have taken


- Here we have created a different model with the subscription name


- In this case, in the user model, we can create an array with the subscriber name and push all the ids inside it, 

- but the channel has millions of subscribers (very large data), so if we had to make some changes, it would be an issue


- If the first user unsubscribes, the entire data structure has to be re-arranged, which would be a very expensive operation

        
- Now the point is that to count the subscribers in the channel profile, we have designed a structure/model in the database for the subscribers who take the subscription, which has two fields.
   
   - subscriber 
   - channel


- Basically we have to understand why these models are different

- when we retrieve data from this model (basically perform a join operation), then how will we get the data from it,

   
   - Let's first understand what this data is right now
   - How to bring the data

----------------------------------------------

Schema mein do cheezein hai subscriber and channel , hai toh dono user hi , 



- jaise koi youtube channel hai woh bhi user hi hai and humare jo account hai wo bhi channel hi hai but hum waha pr videos nhi dalte hai internally dekha jaaye toh wo user bhi hai 


- subscriber aur channel dono entities actually user hi hai, bas unka role ya context alag hai.


- Toh schema mein subscriber - bhi ek user hi hai and channel jiska hai wo bhi user hi hai


 
    - User: Ye base entity hai, jisme common details hongi jaise userId, name, email, profilePic, etc.


    - Channel: Ye bhi user hi hai, but channel ka role thoda extend hota hai, 
         
         -  jaise ki uske paas videos, subscribers list hoti hai. 

         - Har user apne account se channel create kar sakta hai ya default channel hi hota hai.


   - Subscriber: Ye ek relationship hai — jo bataata hai ki ek user (subscriber) dusre user (channel) ko follow kar raha hai.


subscriberId aur channelId dono userId hi hai, bas ek subscriber ke role me hai aur ek channel ke role me.



  - Har channel ek user account ke through managed hota hai.

  - Har subscriber bhi user hi hai, jo subscribe karta hai dusre user ke channel ko.

-----------------------------------------------


ab humne do fields hi kyu rkha subscriber channel array kyu nhi in subscription schema and array nhi toh yeh schema kaam kaise krega 


jab hum lookup , aggregation pipeline kya hote hai and kaise use krenge 

excalidrawwwwwwwwwwwwwww ki mc h


  subscription model samjh liya ::


-----------------------------------------------

- MongoDB aggregation pipelines ::  Series on Aggregation pipelines on hitesh chaudhary pe available if gain more knowledge then hum padh skte hain

  - ab hum basically join krenge subscriptions ko users ke andar ( issi ko bola jaata hai left join )

  - basically join ka ye matlab hai subscriptions se jitni information milti hai usko join krdo users ke andar


- Aggregation pipeline kuch nhi stages hoti hai ek stage -->  dusri stage --> teesri stage 
 
  - each stage performs an operation n the input documents 
  
  - for example :  jaise maan lijiye jaise hmne ek stage pe filtering laga di ki humein 100 mein se 50 hi document select krke do kisi bhi condition ke basis pe 
  
  - toh next stage ke liye 50 document hi original dataset hai , 50 document pe hi applicable hoga jo hum process krenge ab 


  - documents that are output from a stage are passed to the next stage 



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
   - name: "Kartik"
   - birth_year: 2004
   

- kisi dusre document author ka _id ( jaise mongoDB mein user ka bhi _id hoga jab naya document banega  )


- toh ye dusre document mein match krna chahiye and humara dusra document hai authors
and  same _id match hogya hai 


- toh dono ko join kraya jaa skta hai and then join krate hi hai jaha jaha pr author_id : 100 hoga waha waha pr document ki puri information aajayegi


   :::: Ab join kaise kiya jaaye ( books ke andar ):::

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


- foreignField: _id  ::: The field in the from collection that can be used as a unique identifier in the primary collection.



- as : "author_details" ::: result Array ka name 


- ab isse hua kya ki humare pass aaya hai author_details naam ka array aaya hai books document mein jiske andar object aaya hai jisme bhi author_id: 100 ( jis author ki _id 100 hai )
uska saara data aagya hai



ab jo new document hai wo kuch aisa banega 

   author_details: Array() jiske andar object hai and information ha author ki and baaki information toh hai document Books ki


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

- toh pure lookup hai uske value ko variable mein store krado ( and humein return milta hai Array (author_details ) lookup ke baad )

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
      }, // returns array jiske first index par information hai author ki
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


 

- Jab bhi hum kisi channel ki profile humein to usually kya krte hai , toh hum uss channel ke URL pe jaate hai 

- req.params ::  This property is an object containing properties mapped to the named route “parameters”.

for example:: 

GET /user/tj
console.dir(req.params.name)
// => "tj"



9. $addFields:

   - Adds new fields to documents.

   - Use: Add computed fields or modify existing ones without changing the original structure.

- jisse hum ek hi object mein saara data bhej de



10. $project:

    - Reshapes documents by including or excluding fields, adding computed fields, or changing the structure.

    - Use: Modify the output format of the documents (e.g., changing field names, creating new computed fields).