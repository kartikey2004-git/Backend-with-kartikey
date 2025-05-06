- User = koi bhi banda jo platform pe hai (chahe subscriber ho, ya creator ho — sab user hi hain)

- Channel 
   
     - basically ek user ka public profile jisko dusre log subscribe karte hain (YouTube model jaisa) 

     - channel bhi ek user hi toh hai tabhi hum saare functionality like  comments likes kr skte hai , usko jo subscribe kr rhe hai wo bhi toh user hi hai 



- Subscription 
   
     - ek connection hai subscriber user aur channel user ke beech. 

     - subscription mein hota kya hai basically ek channel hota hai us channel ke bahut saare subscribers hote hai 





- agar hum model bana rhe hote toh user ke andar hi subscription rkh dete but best practice ki subscription ko alag se ek model rkhna chahiye 


- Agar tum User model ke andar array banaoge

  - Ye small scale pe theek hai, but jaise-jaise subscribers badhenge (jaise 10K, 1M), to array bada ho jaega aur query, update, consistency me dikkat aayegi.



- Best practice ➔ Hamesha Subscription ko alag model me rakho.

Kyuki fir tum relational queries maar sakte ho, indexes laga sakte ho (subscriberId, channelId ke upar), aur scale karna easy ho jaega.



Phir Tum Subscription model me multiple fields add kar sakte ho — jaise 

  - membershipTier
  - subscribedFrom (mobile/web)
  - expiresAt
  - paymentStatus

( ho skta hai subscriber ke andar hum multiple objects bhi add krde , ki humein aur info add krni hai user )


---------------------------------------------------


kyuki kayi jagah aisa hoga ki humein user ki profile display krani hai 



- subscription related info bhi chahiye hoti hai, jaise

     - Kitne subscribers hai us user ke (channel ke liye)

     - Kya current logged-in user ne usko subscribe kiya hai ya nahi ( ki jis bhi user ke page pe hum aye usse ye subscribed hai ya nhi )

     - Uske subscription ka koi extra detail (tier, date, etc.)



- User ki profile hamesha User model se aayegi.

- Subscription info tum Subscription model se query karke laoge.



- User ki profile + uske stats + current user ka subscription status
(yeh sab tum backend pe alag queries chala ke merge karoge response me)



- Kyun Subscription ko alag model rakhna sahi hai is case me?

   - subscriberCount ➔ Tum bas count(*) maaroge Subscription table pe channelId = user_999

   - currentUserSubscription ➔ Tum check karoge where subscriberId = currentUserId and channelId = profileUserId



Simple query
  
  - No need to store large arrays inside user document
  
  - Easily scalable (1 user ke 1 million subscribers ho jae to bhi tension nahi)

---------------------------------------------------

Controller for simply se user se current password change krwana hai 

- we don't check passowrd change krte samay ki user loggedIn hai ya nhi , cookies hai ya nhi , kyuki jab route banayenge tab laga denge , auth middleware verifyJWT 


jab newPassword and confirm password same ka check lgta hai bss jab hum confirm password field aad krte hai ( ye checking frontend pe bhi hojati hai )


  - sabse pehle humein user chahiye hoga and then uske andar hum field mein jaake user ko verify krwa paunga 

  agar user password change krwa pa rha hai toh wo loggedIn toh hai ,
  
  - ye loggedIn kaise ho payega , kyuki middleware lagaya hai verify JWT , and humne banaya tha ek object req.user mein user aa jayega 

  - waha se user id mil jayegi uske basis pe hum Database mein  loggedIn user ko access kr skte hai

---------------------------------------------------

Flow 

- Step1. User Already Logged In (JWT se)

    - Tumne middleware lagaya hai jo JWT token verify karta hai.

    - Middleware ke baad har route pe req.user me verified user ki info aa rahi hai.

    - Toh req.user.id se hamesha current loggedIn user ki ID milegi 

 
- Step 2: Database se Logged In User Ko Access Karna

   - Ab user ki ID mil gayi req.user.id se.

   - Ab DB me jaake us user ko fetch karenge (for password verify or change):


- Step 3: Password Change Logic

    - Pehle user ko verify karenge (old password match se)

    - Fir new password ko hash karke update karenge



concept ::: 

User already loggedIn hai (kyuki JWT verify hua middleware se)

req.user me authenticated user ka data aa chuka hai

Us user.id ke basis pe hum database me user ko access kar ke password update kar sakte hain

::::

---------------------------------------------------


hum user model mein toh custom methods bhi bana skte hai 

- Ye custom methods aapke user model ki functionality ko extend karne ke liye kaafi useful ho sakte hain. 


    - 1. Code Reusability :: Aap jo bhi custom logic likhte hain, usko aap multiple jagah reuse kar sakte hain bina baar-baar likhe.

         - Example: Agar aapko user ke password ko check karna ho (jaise password validation), toh aap ek custom method likh kar use har jagah reuse kar sakte hain.


     - 2. Encapsulation of Logic :: Model ke andar aap logic ko encapsulate kar sakte hain, jo code ko cleaner aur maintainable banata hai. Iska matlab hai ki model ke bahar complex logic ko handle karna nahi padta.

         - Example: User ke status ko check karna ya role-based permission check karna.


     
     - 3. Validation & Authentication: Aap custom methods mein user validation, token generation, password hashing, etc. implement kar sakte hain.



     - 4. Optimized Queries: Agar aap complex queries run kar rahe hain, toh custom methods ka use karne se aap query ko optimize kar sakte hain aur better performance achieve kar sakte hain.


- Database always in another continent 

---------------------------------------------------


- humein ek endpoint to banana padega jaha pr hum current user ko get kr payein  :: agar user loggedIn hai toh it's damn easy to get current user

   - Tumhara auth middleware JWT ya session ko verify karta ha

   - and Uske baad humne current user info ko req.user me store kar diya hai (jaise id, email, role, etc.)

---------------------------------------------------


- Right now we have only changed the password, if we have to update other details of the user then how would we do it, 

- we will have to decide as to what backend devs am I allowing the user to change and what not to do






Concept :::: Micro updates / Field-specific mutations kehlata hai, aur ye bade level pe scale karne me bohot help karta hai (e.g., social media apps, SaaS tools).




Note :: (modular & optimized updates) — wahi industry standard approach hai. 

- production level advice agar kahi pe file update krwa rhe hai toh uske controller alag rkhne chahiye , alag endpoints rkhne chahiye - better approach 

- jaise user sirf apni image update krna chahta hai , toh usko whi ke whi image ko update and save krne ka option dedo , 

- endpoint hit krdo apna kaam hojata h ,  pura user save krte hai toh cache data bhi wapas aajata hai ( usko lene ki jarurat nhi hai )

- network congestion +  performance boost naturally kam ho jata hai.
   
   - Chhota payload jaata hai (pura user object bhejne ki zarurat nahi).

   - Chhota response aata hai (cache ya database se pura user wapas lane ki zarurat nahi).


- Server load kam hota hai (DB ko heavy reads/writes se bachate ho).

-  Network traffic lean rehta hai 



- Agar user sirf image update kar raha hai, toh uske liye ek dedicated endpoint hona chahiye, 

 ```bash
 /users/:id/profile-image
 ```
   
- Ye sirf image field ko update karega, na ki pura user document ko fetch/save karega. 

     - Bandwidth kam lagegi.

     - Cache invalidate karne ki zarurat nahi (pura user data wapas nahi lana padega).


Frontend se specific data hit karta hai (na ki bulky payload).

Pura user refetch karne ki zarurat nahi hai.


---------------------------------------------------


- MONGO DB operators :: Cheatsheet 
"C:\Users\karti\Downloads\mongodb_operators_master_cheatsheet.pdf"


- mongoDb mein bahut saare operator hai and aggregations bhi hai 
    
    - $set hai 
    - $count hai for counting  
    - $sum

Controllers ::

  -  changeCurrentPassword 
  - getCurrentUser

  ab humara kaam hogya hai text based data ko update krna in

   - updateAccountDetails 


--------------------------------------------------


Ab hum chalte hain file update ke flow ki taraf.

   - File upload ke time heavy load lene ki zarurat nahi hai, humein sirf middleware level par handling pe focus karna hai.

   - Sabse pehle humein multer middleware lagana hoga, jo file ko accept karega.

   - File update ka access sirf wahi user ko milega jo logged in hoga, isliye humein verifyJWT middleware bhi lagana hoga. 

   - Dono middleware ko hum route level pe lagayenge taaki authentication aur file parsing dono secure aur smooth ho.

   - End me routing ke waqt hum ensure karenge ki file upload, auth check, and update logic sahi sequence me chale."


---------------------------------------------------

From Now :: Yes we can write more controllers and endpoints depending on what other feature requests are being made

  
  - There are still two cases left
    
    1. Challenge 1. Easy-mid challenge ( videos )

     - If someone wants to see their watch history, how can they retrieve it?

     - watch history is a bit unique  because inside watch history id's are present, there are a lot of videos here 

     -  we will have to find out how we can take data from the video model to the user model


    2. Challenge 1. mid-Hard challenge ( Subscriptions )
      
     - If we take a user's profile, we will send the user's data and also send the count of his subscribers.

     - I will also have to see whose channel we are going to and  even there we will ask to send all the details of the user

     -  then we will also send his subscriber count + we will also send whether we are his subscribers or not and more details ....


- Also we will discuss how pipelines are written further  , how to read populate 


--------------------------------------------------


- Flow in updating Avatar 
  
  - 1. Multer se Image Input
     
     - Client se multipart/form-data ke through image file aayegi.

     - multer middleware se us file ko server pe temporarily le loge.


  - 2. Upload to Cloudinary

     - Multer se mili file ko cloudinary uploader me daloge.

     - Cloudinary se tumhe ek secure URL milega image ka.

     - Cloudinary ka public_id bhi milega jo delete ke time kaam aayega.

  - 3. JWT Verify Middleware Se Current User     Pakadna

     - Tumhare JWT middleware me tum req.user = { id, email, ... } ek naya object set karte hai jo ki loggedIn user hota hai .

     - So ab req.user.id se db call karke current user ka record modify kar sakte ho.

   - 4. Delete Previous Image From Cloudinary

     - Purana public_id DB me store karte ho na (avatar_public_id)

     - Cloudinary ke destroy() function se use delete kar doge.


  - 5. Database Me New Avatar URL Set Karna

     - User ka record (by ID) update karoge aur new avatar URL dal doge.

     - Example: User.findByIdAndUpdate(req.user.id, { avatar: newUrl })


   - 6. Abhi main sirf avatar URL save kar raha hai DB me. Lekin

    - Jab user naya avatar upload karega, to purana image Cloudinary pe padh rahega — space lega.

    - Cloudinary pe image delete karne ke liye URL nahi chalta, balki public_id chalta hai.


  7. Add-on 

   - Purana avatar jo Cloudinary pe pada hai, usse delete karne ke liye ek utility function banana padega .

   - Ye best practice hai — warna user ke old avatars Cloudinary pe unnecessary space lete rahenge (and storage ka bill badhega ).



------------------------------------------------------

User Avatar Update ka Pura Approach
  
  1. Frontend Se File Aati Hai (Multer Middleware Se)
    
    - User jab naya profile image upload karta hai, wo file humari API pe aati hai.

    - multer middleware is file ko local path pe save karta hai → req.file.path me milta hai.

  2. Avatar Local Path Check
    
    - Pehle check karte hain ki file mili bhi hai ya nahi

    - Yani agar file nahi aayi toh turant error throw karenge.

  3. Pehle Purana Avatar Delete Karte Hain (Cloudinary Se)

    - Apne User model me pehle se avatar_public_id save hai.

    - Usko Cloudinary pe delete karne ke liye utility function call karte hain

    - Yani pehle old image delete kar rahe hain cloud se — taaki storage me junk na bane.


4. Naya Avatar Upload Karte Hain Cloudinary Pe
 
    - Jo user ne abhi file bheji hai (avatarLocalPath) — usko Cloudinary pe upload karte hain utility function se

    - Isse hume url (image link) aur public_id (Cloudinary ka unique id) dono milte hain.


5. User Model Me Naya Avatar Save Karte Hain
   
    - Ab hum user ka avatar URL aur avatar_public_id DB me update karte hain

    -  Ab se user ki profile me naya image URL dikhai dega.

6.  Response Me Updated User Data Send Karte Hain
Hum updated user ko return karte hain password field ko hata kar

   - Tujhe user object ka response dena hai password field hata ke — aur tune JWT verify me user object already attach kar rakha hai (jaise req.user).



Another approach we try :::  

- At the time of image upload 
    
    - sabse pehle humein multer middleware se req.files 
    
    - ab humara cloudinary wagerah use krne ka mann nhi hai , toh hum isi situation mein database mein ise save kra skte hai
