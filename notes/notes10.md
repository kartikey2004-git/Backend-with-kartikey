refresh token , access token 
modern practice application like gmail uses both

difference in expiry dates ::b

  - access token usually short lived hote hai 
  ( short duration mein expire krdiya jaata hai )

  - refresh token usually long lived hote hai 
  ( long duration mein expire krdiya jaata hai )


jab tak humare pass access token hai , koi bhi feature jaha pr authentication ki requirement toh hum access kr skte hai uss resource ko


  - for example har kisi ko file upload nhi krne diya ja skta hai server pe , only for authenticated users

  
  - login session maan lijiye expire krdiya 15 min mein hi for security reasons toh phir se authenticate krna padega 




Here refresh token comes in picture ( we save it in database and give it to user as well )
   
   - We validate user with access token only
    but there is no need to enter password every time

   - if we have refresh token then on hitting an endpoint if user's refresh token and refresh token in database are same, then we will get new access token


 
- We give the access token to the user but we also keep the refresh token secure in the database so that we don't have to ask the user for the password again and again.


- jo user h document ya object hi toh hai jiske andar saari properties hain 

- Mongoose ka model ka schema (jo humne banaya hota hai) apna validation kick in karta hai.

- Ye validations fields ki checking shuru kar dete hain:

   - required fields check hongi 

   - maxlength, minlength, enum, match (regex), wagairah check hote hain 

   - Custom validators bhi tabhi chalenge 


```bash
await user.save({ validateBeforeSave: false });
```

- Toh validation skip ho jaata hai.

---------------------------------------------------


HTTP cookies (also called web cookies, Internet cookies, browser cookies, or simply cookies) are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or other device by the user's web browser. 


Cookies are placed on the device used to access a website, and more than one cookie may be placed on a user's device during a session.



   - Stored on the client-side: Cookies live in the user's browser.

   - Key-value pairs: Each cookie is a string of key and value (e.g., user=kartikey).

   - Sent with every HTTP request: When you visit the site again, the browser automatically includes relevant cookies in the request headers.

   This is how websites remember you.



Use cases:

  - Session management (login sessions, shopping carts)

  - Personalization (theme preferences, language)

  - Tracking (analytics, ads)


- Cookies are limited in size (~4KB per cookie).

- Too many cookies can slow down requests (since they’re sent every time).

- Security flags like HttpOnly, Secure, and SameSite are crucial for safe cookie usage.

---------------------------------------------------

When sending cookies in browser 

- Final Approach:

    - Filter out the unnecessary fields from the response.

    - Check if the refresh token is empty and update it without an additional DB query if needed.



1. Unwanted Fields in User Object:
   
   - You are fetching the user object (probably from a database). 
   
   If you have sensitive or unnecessary fields (like the password), you should filter out these fields before sending the data back to the client. 


2. Empty Refresh Token

   - If the user's refresh token is empty, you need to decide how to handle it:

       - You can update the user's refresh token in the database if it's missing or empty.

       - Or you could check if the refresh token is empty and only update it if necessary.


3. Updating vs querying: 

    - If your goal is to only update the refresh token (and not perform other checks or operations), 
    
    - it's generally cheaper to directly update it without a second DB query, especially if you're sure that the token should be updated when empty.


    - However, if you need to verify some conditions before updating the token, a second DB query might be necessary

    - In general, if your update condition is simple (like checking if the refresh token is empty), just perform the update directly, as querying again would be an unnecessary overhead.





- When you set a cookie with the httpOnly: true option


    - It cannot be accessed or modified by frontend JavaScript (document.cookie won’t show it).

    - Only the server can read/write it through HTTP requests (like during API calls).

    - This protects sensitive info (like refreshToken or session IDs) from XSS (Cross-Site Scripting) attacks.




- If you skip httpOnly:

    - Any script running in the browser can read or modify the cookie.

    - Hackers using XSS can steal your sensitive tokens.



1. .cookie-parser:

    - It’s a middleware for Node.js (specifically for Express.js) that makes it easy to read cookies sent by the client (browser) in requests.

    - Without cookie-parser, you’d have to manually parse the Cookie header — which is messy and repetitive. 
    
    - cookie-parser does this automatically and populates the cookies on req.cookies

---------------------------------------------------


-  setting tokens in cookies ✔️ (good for browser-based apps, especially with httpOnly for security).

- BUT you are also sending tokens back in JSON response


   - This means
    
      -  Frontend can save these tokens in localStorage or AsyncStorage (in mobile apps like React Native, Flutter, etc.).

      - Or frontend can ignore the response tokens and rely only on cookies.



Client Type	      Best Practice for Token Storage

Web (Browser)	  ::   Use httpOnly cookies (safer from XSS)

Mobile Apps	    ::   Use local storage or secure storage

SPAs (React, Vue) ::   
	Mix of httpOnly cookies (refreshToken) + memory storage (accessToken)



- Send tokens in both cookies and JSON.

    - Browser ➔ use cookies.
    - Mobile ➔ read tokens from JSON and store.

---------------------------------------------------


How big firm do it  ?

   - They send accessToken only in JSON (memory storage) 

   - and Keep refreshToken in httpOnly cookie.

   - This makes the app resistant to XSS (because refresh token isn’t exposed)

   - And resistant to CSRF (with proper sameSite: 'Strict' cookies)


---------------------------------------------------

  - Logout ka matlab hai

    - Session tokens ( cookies se ) invalidate karo (cookies + DB se refreshToken hatao) 

    - Client side ko bhi tokens hataane ko bolo ( refresh token jo hai user model mein wo bhi clear hona chahiye and  reset krna padega )


```bash

// Logout request
POST /logout { email: "kartikey@example.com" }

// Server code:
const user = await User.findOne({ email: req.body.email });
user.refreshToken = "";
await user.save();

```

Problem Here :
   
   - Koi bhi banda random email deke kisi bhi user ka refreshToken reset kar sakta hai ➔ Forced logout attack

   - Isiliye logout hamesha authenticated user ke against hi hona chahiye :: not based on body params like email



Middleware ka matlab hai jaane se pehle milke jaiyega 

   - req and response ye object hi toh hai isme value jaise cookies add hogyi cookie-parser ke through , files add hogyi multer ke through



cookie-parser lagane se cookie access kr pa rhe hai , cookies two way access hoti hai both ( req,res) because humne middleware add kiya h


- Headers in a request are key-value pairs sent along with HTTP requests (or responses). They carry metadata about the request or give extra instructions about how the server or client should handle the request.

For example

```bash
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
});
```


---------------------------------------------------

- Correct & Secure Approach (JWT or Session Based)


   - Step-1 :: Pehle ensure karo ki logout route pe aane wali request pe JWT verify ho chuka hai.
   ( auth middleware se  JWT verify karva denge ki user hai ya nhi hai )

   When the user was logged in, we gave him an access token and a refresh token, based on these we will verify the user

   If we have the correct token, we will add a new object req.user to req.body 


   Matlab :

      - Request ke headers me Authorization: Bearer token
      - Ya user ki cookie me accessToken

  - Step 2 :: JWT verify hone ke baad, hum middleware me req.user ko set karte hain ( req.user aata hai auth middleware se jo JWT verify karta hai. )


  - Step 3 :: Ab logout ke time req.user._id se hi user find karo — not from request body 

---------------------------------------------------


Important Rule

   - Never trust email/body param for logout.

   - Always trust the authenticated session/token user  req.user.


Final  :: Hum token se user verify karenge ➔ aur req.user me inject karenge.

Logout time:

   - Clear cookies

   - DB me se refreshToken ko bhi null karo (varna token reuse ho sakta hai)


login ka verification hoga auth middlware mein jwt token verify krne se


- find by id bhi use kr skte hai , phir user laana padega uska refresh token delete krna padega and phir save krna padega with validatedbeforeSave : false 

- better hai ki findbyIdAndUpdate krle

