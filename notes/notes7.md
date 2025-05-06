Advanced Understanding of HTTP Headers & Data Transmission

1. X- Prefix in Custom Headers (Old Style)
     
    - Pehle jab bhi hum apne custom headers banate the (jo standards ke part nahi the), X- se prefix karna mandatory hota tha.

Example:

```makefile
X-Request-ID: abc-123
X-Auth-Token: someToken
```

Today: X- prefix officially deprecated ho chuka hai (RFC 6648).

  - Ab hum directly meaningful naam rakhte hain.Example: request-id, auth-token

But, purane codebases mein tumhe X- headers abhi bhi kaafi jagah milenge.


2. Different Types of Headers


   - Request Headers ::	Client se server ko bhejne wale headers. (e.g., Authorization, Accept)

   - Response Headers ::	Server se client ko bhejne wale headers. (e.g., Content-Type, Set-Cookie)

   - Representation Headers	:: Content ka format, encoding, compression define karte hain. (e.g., Content-Encoding: gzip)


   - Payload Headers	:: Jo actual data bheja jaa raha hai uski details. (e.g., Content-Length, Content-Type)

   - Security Headers ::	Client-server dono ko secure karne ke liye. (e.g., Strict-Transport-Security, Content-Security-Policy



3. HTTP Status Codes & Payload


Standard practice yahi hai ki agar server 404 Not Found bhej raha hai, toh generally koi payload nahi hota.

Lekin technically possible hai:

Tum 404 ke sath ek detailed error message bhi bhej sakte ho (jaise JSON body mein error ka explanation).


```json
{
  "error": "The resource you are looking for does not exist."
}
```



Note :   But, industry standards ke hisaab se — 404 ka matlab mainly hota hai "request ka resource nahi mila, that's it."




4. Data Compression in Real World Applications


Jab hum mobile apps ya large APIs mein kaam karte hain:

- Data ko compress karke bhejna padta hai (bandwidth bachane ke liye).

- Example compression: gzip



Headers bataate hain

```css
Content-Encoding: gzip
```

Client (mobile app, browser) ko compressed data extract (decompress) karna padta hai before using.




-  Zerodha (live stock charts → compressed data packets)

-  Razorpay (transaction history, analytics dashboard)

-  Gaming apps (live data updates, leaderboard info)



5. Network Limitations & Optimizations

  - Network Bandwidth limited hota hai.

  - Agar data compress nahi karte  :: To latency badh jaati hai (data aane mein time lagta hai).

  - Experience slow ho jaata hai.



Isliye:

- Data compress karke bheja jaata hai.

- Batching karke multiple chhoti chhoti requests ek saath bheji jaati hain.

- Lazy loading / pagination use ki jaati hai.


---------------------------------------------


Standardized HTTP Headers and Their Real World Use

1. Accept Header
 
 - Purpose: Client server ko batata hai ki wo kis type ka response expect kar raha hai.


```vbnet
Accept: application/json
Accept: text/html
Accept: image/png
```

   - Browser → HTML expect karta hai (text/html).
   - Postman → JSON expect karta hai (application/json)

Server yeh check karta hai aur usi format mein response bhejta hai.



2.  User-Agent Header

   - Purpose: Client (browser/app/tool) apni identity server ko batata hai.


```sql
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
```


Is header se pata chal jaata hai:

  - Request browser se aayi hai ya Postman se?
  - Browser kaunsa hai? (Chrome, Firefox, Safari)
  - Browser ka engine kaunsa hai? (Gecko, WebKit)
  - Operating system kaunsa hai? (Windows, macOS, Android, iOS)


- User-Agent se user ki device aur environment ka full profile mil jaata hai.



-  How Companies Use User-Agent in Real Life


Jab user mobile browser se site open karta hai
   - Server detect kar leta hai: "Oh, yeh mobile device hai."


Fir site automatically popup dikha deti hai
   - "Install our app for a better experience."


Example

Facebook, Instagram, Flipkart, Zerodha jaise apps —

   - Mobile browser detect karte hi App Install Banner show karte hain.



3. Authorization Header
   
   - Purpose: API calls ke andar user authentication aur security ke liye.

Example: JWT Token Authorization 
    
```makefile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

JWT (JSON Web Token) ka format:

```css
HEADER.PAYLOAD.SIGNATURE
```


Use Case:

   - Jab frontend (React, Angular, Vue) kisi protected API ( Secure API calls ) ko call karta hai, toh JWT Token Authorization Header ke through bhejna padta hai.

   - Agar valid token hai → API access allow hoga.

   - Agar invalid token hai → 401 Unauthorized error milega.



 JWT kaam kaise karta hai?

   - Login hone ke baad, server JWT Token generate karta hai.

   - Frontend localStorage / sessionStorage ya cookie me store karta hai.

   - Har API request ke sath Authorization: Bearer <token> header bheja jata hai.


 
4. Content-Type Header

  - Purpose: Server ko batata hai ki request/response ka format kya hai.


```less
Content-Type: application/json    // JSON Data
Content-Type: text/html           // HTML Page
Content-Type: image/png           // PNG Image
Content-Type: application/pdf     // PDF File
```


Real-world Use Case:

   - Agar tum image upload API bana rahe ho, toh Content-Type: image/jpeg ya multipart/form-data set karna padega.

   - Agar API JSON data expect kar rahi hai, toh Content-Type: application/json required hoga.


Content-Type Header ensures ki data format correctly handle ho.




5. Cookies (User Sessions & Tracking)
   
  - Purpose: User state maintain karna, authentication aur tracking.


- Cookies ek key-value pair hoti hai jo browser store karta hai.


```mathematica
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; Max-Age=3600
```


Important Cookie Flags:

   - HttpOnly → JavaScript se access nahi kiya ja sakta (security reason).

   - Secure → Sirf HTTPS pe kaam karegi.

   - Max-Age=3600 → 1 hour tak valid rahegi.



 - Jab user login karta hai, toh sessionId cookie save hoti hai.

 - Next request pe server check karta hai ki valid session hai ya nahi.

  - Example: Gmail, Amazon tumhe logged-in rakhte hain using cookies.



6. Cache-Control Header
   
  - Purpose: Data kab tak cache hoga aur kab expire hoga.


```arduino
Cache-Control: no-cache        // Request har baar fresh data fetch karega

Cache-Control: max-age=3600    // 1 hour (3600 sec) tak cache valid rahega

Cache-Control: public          // Sab log cache use kar sakte hain

Cache-Control: private         // Sirf user ke liye cache hoga

```



Use Case:

  - Agar tum ek news website bana rahe ho → Tum chahoge ki articles 1 hour tak cache ho.

  - E-commerce sites (Amazon, Flipkart) dynamic pricing ke liye no-cache use karte hain.


   

Cache ka basic matlab:
"Cheezein temporarily store kar lena future mein fast access ke liye."


HTTP mein jab client (browser/app) request karta hai server se data (jaise HTML, JS, CSS, images, API data),

toh baar-baar wahi data request karne ki jagah browser ya intermediate proxy servers usko cache kar lete hain.


 Iska fayda:

   - Fast loading 
   - Network traffic kam 
   - Server pe load kam 
   - User experience better 


--------------------------------------------------


Production Apps mein Important Headers


1. CORS (Cross-Origin Resource Sharing) Headers
   
   - Jab ek domain (example.com) dusre domain (api.example2.com) pe request bhejta hai, toh by default browser block kar deta hai.


   - Isko allow karne ke liye CORS headers set karne padte hain.



Access-Control-Allow-Origin	:: Kaunse origins (websites/apps) ko access allowed hai.

Access-Control-Allow-Methods :: Kaunse HTTP methods allowed hai (GET, POST, PUT, DELETE).

Access-Control-Allow-Headers ::	Kaunse custom headers allow honge (jaise Authorization, Content-Type).

Access-Control-Allow-Credentials ::	Cookies ya authentication information allow karni hai ya nahi.





```http
Access-Control-Allow-Origin: https://myfrontend.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```



  - Sirf https://myfrontend.com se request allowed hai.
  - Sirf GET, POST, PUT methods allowed hain.
  - Authorization token and Content-Type header allowed hain.
  - Cookies ya session-based authentication allow hai.



CORS headers sirf "allow" karte hain —
Actual protection / block karna humko backend code mein karna padta hai.
Sirf header likhne se automatically kuch nahi hota!



 2. Security Headers


Web applications ko XSS attacks, clickjacking, data theft se protect karne ke liye use hote hain.



Content-Security-Policy ::	Kis source se resources (JS, CSS, Images) load karne allowed hain. (XSS Attack rokta hai)

X-Frame-Options	:: Clickjacking attacks ko rokta hai (DENY, SAMEORIGIN).

X-Content-Type-Options	:: Browser ko MIME sniffing se rokta hai (force karta hai correct Content-Type).

Strict-Transport-Security (HSTS)	:: Sirf HTTPS connection allow karta hai, HTTP ko block karta hai.

Referrer-Policy ::	Kaunsi information referrer ke roop mein bhejni hai (privacy ke liye).



```http
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:;
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: no-referrer-when-downgrade
```


   - Sirf apni website ke resources allow honge (self).
   - Frame ke andar humari site ko koi embed nahi kar sakta.
   - Browser content sniffing nahi karega.
   - Only HTTPS allowed for 1 year (31536000 seconds).
   - Privacy maintain hogi user navigation mein.


 - "Production grade headers sirf ek meta information dete hain, lekin security, authorization, permissions ka real kaam backend logic mein hota hai." 



--------------------------------------------------


HTTP Methods - Core Understanding

- agar humne kabhi postman ya thunder client galti se khol liya ho dropdown ke andar , jaha pr http methods ki ek long list open hojati hai

Basic Concept:

   - HTTP Methods define karte hain ki Client kya operation perform karna chahta hai server pe.

    ( basic set of operations that can be used to interact with server )


Matlab:

   - New data banana hai? (Create) :: jaise humein koi data send krna hai toh database mein ek new entry hojaye toh specific method hai uss kaam ke liye 

   - Data padhna hai? (Read) :: agar mein request kr rha hu server se ki mujhe ye data wapas bhej do toh bhi ek specific method hai 

   - PATCH	Server pe agar ye data ka kuch part hi update krna hai toh alag operation 


   - Data update karna hai? (Update) :: agar pura hi data update krna hai toh ek alag operation hai 

   - Data delete karna hai? (Delete)


---------------------------------------------------



GET

  - Retrieve a resource.
  - Example: Mujhe saare users de do, ya mujhe is  email wale user ka data de do.
  - Client decides kya aur kaise lena hai.


HEAD

  - Sirf headers return hote hain, body nahi.
  - Use case: Check user-agent, cache-control without fetching full data.

  - In those cases, sometimes such endpoints are created that send only the headers , the body will not come.



OPTIONS

  - Server se poochte hain: Is endpoint pe kaun kaun se methods allowed hain?

  -  Useful for CORS preflight requests ya API documentation ke cases.

  - Automatic nahi hota humein endpoints banane hote hai , developer ko define karna padta hai controllers mein 




TRACE


  -  Mainly debugging ke liye.
  - Request ka loopback deta hai: agar req bheji h toh res bhej deta hai 

  - kayi baar resource proxy ke peeche hota hai , kon konsi proxy se req ja rhi hai , konsi proxy se hote hue req aa rhi hai unke baare mein debugging krna hai 
  
  
  - response timely nhi mil rha hai , hopping bahut jayada ho rhi hai ( networking ka concept )




DELETE

  - Kisi resource ko server se hataana.


PUT

   - Pure resource ko replace kar dena.
   - Example: Ek user ka poora object update kar do. ( koi email id  se resources )



PATCH


   - Resource ka partial update.
   - Example: Sirf email id update karni hai, baaki data as it is rahe.


POST

  - Server pe naya resource create karna.
  - Example: New user, product, ya category add karna.


---------------------------------------------------


HTTP Status codes 

  
1.  Informational responses (100 – 199) ( kuch info pass krna hai user ko ) 

   Purpose: Bas user ko batana ki request receive ho gayi hai, processing start ho chuki hai.

      - 100 Continue: Server bolta hai, "Request sahi ja rahi hai, aage continue karo."

      - 102 Processing: Thoda time lag raha hai process hone mein (e.g., large data upload).




2.  Successful responses (200 – 299) ( ki apne jo data bheja hai woh successfully recieve hogya hai + hum jo operation krna chahte the wo successfully complete hogya hai )

    - Purpose: Jo kaam client ne bola tha, wo successfully complete hogya.

        - 200 OK: Sab kuch sahi se ho gaya.

        - 201 Created: Naya resource successfully create hogya (e.g., database mein ek new user add hua).

        - 202 Accepted: Request accept karli gayi hai, but abhi process ho rahi hai.



3. Redirection messages (300 – 399) ( jo bhi resource ( URL ya method access ) apne dekhne chah rhe the woh ab remove hogya hai , woh kahi or move hogya hai temporarily / permanent depends krta h situation pe )

    - Purpose: Resource ab kisi aur jagah shift hogya hai (temporary ya permanent).
     

      - 307 Temporary Redirect: Resource temporarily kahi aur move hua hai.

      - 308 Permanent Redirect: Resource permanently naye URL pe shift hogya hai.



4. Client error responses (400 – 499) 

  - Purpose: Client se request mein kuch galti ho gayi.

      - client ne login krne ki koshish kri / ya phir koi operation krne ki koshish kr rha hai , token shi nhi bheja hai , password shi nhi bhej rha hai   

      - ki image ka size galat bhej diya , image ka resolution galat bhej diya hai 
   
      - Client se information shi se nhi ayi hai

      - 400 Bad Request: Request galat thi (e.g., image size/resolution galat bhejna).

      - 401 Unauthorized: Login toh kiya hai, lekin kaam karne ka right nahi hai.

      - 402 Payment Required: (Mostly payment related errors ke liye).

      - 404 Not Found: Jo resource client dekhna chahta tha, wo exist nahi karta.



5. Server error responses (500 – 599)
 
  - Purpose: Client ka kaam sahi tha, par server side pe dikkat aagayi.

      - 500 Internal Server Error: Server mein koi generic problem (e.g., AWS down).

      - 504 Gateway Timeout: Server se dusre server ka response time par nahi aaya.
      
      - ki client ne toh shi se image bhej di , humne API call kra aur image upload krne ki try kri , network break hogya , network mein traffic jyada hai , congestion jyada hai aur image upload nhi ho payi , kisi reason se toh server error h 



Standards


100 : Continue 
102 : Processing ( ho skta hai jyada data bheja ho , aur time lg rha ho )

200 : OK
201 : sucessfully resource created hogya hai database mein

202 : client ne jo data bheja hai wo accept hogya hai 

307 : temporary redirection
308 : permanent redirection

400 : Bad request
401 : Unauthorized Req ( login h but uss kam ko krne ke liye authorised nhi hai )

402 : payment related request
404 : NOt Found ( Client ne aisa resource access krliya hai jo available hi nhi hai )

500 : Internal Server Error ( AWS wagerah down hojate hai kayi baar , uss tarike ke outage mein 500 error aati hai  )

504 : Gateway timeout



- Terms : Network Lag

- kis tarike se data structure ko optimised krdu ki user ko processing ka wait na krne pade ...


 