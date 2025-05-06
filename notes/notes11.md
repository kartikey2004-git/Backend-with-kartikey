- Access Token ::	Short-lived token used to access protected APIs	 (minutes to 1 hr)

- Refresh Token ( Session storage )	:: Long-lived token used to get new access tokens	(days, weeks, or months)


Access Token 
   
   - This is what your frontend or client app sends with every request to a protected backend API.

  - Usually a JWT (JSON Web Token), but can also be opaque strings.

  - Short. (e.g., 5 minutes to 1 hour) — to minimize damage if stolen.



Stored in
   
   - Frontend: Usually stored in memory (best), or HTTP-only cookies.

   - Should NOT be stored in localStorage due to XSS risks.


---------------------------------------------------


Refresh Token

   - Used to get a new Access Token when the old one expires — so users don't have to log in again.

   - Usually a secure random string or JWT.

   - Long. (e.g., 7 days, 30 days)


   - Mostly HTTP-only cookies (secure and less prone to XSS attacks).

   - Should never be exposed to JavaScript in frontend apps.



When Access Token expires, the client sends the Refresh Token to the backend.

Backend verifies it, and if valid, sends a new Access Token.


---------------------------------------------------


  - Security	Access Tokens are short-lived. If stolen, the damage window is small.

  - Persistence	Refresh Tokens make login persistent (e.g., "Remember me" features).

  - Rotation	New Access Tokens can be issued without requiring login again.

---------------------------------------------------


- Best Practices To Follow ( Do's )

    - Use short-lived Access Tokens and long-lived Refresh Tokens.

    - Store Refresh Tokens in HTTP-only, Secure cookies.

    - Rotate Refresh Tokens on every use (called Refresh Token Rotation).

    - Revoke ( to officially cancel something so that it is no longer valid ) tokens on logout or suspicious activity.


- Best Practices To Follow ( Don't )

    - Never store tokens in localStorage (vulnerable to XSS attacks).

    - Don’t send Refresh Tokens in URL params (they can be logged accidentally).


---------------------------------------------------


Token Types

  - Access Token ➔ Short lived (frontend ke paas hota hai — memory ya cookie mein).

  - Refresh Token ➔ Long lived (DB + httpOnly cookie + session storage logic backend side pe).



Token Refresh Flow

1. 🧑‍💻 User makes a request with Access Token: ( Make user constants work )
   
   - Frontend sends request with Access Token (generally in Authorization: Bearer <token> header or cookies).

2. ❌ Access Token expired ➔ Server returns 401 

    - Unauthorized :: Means "Access token time up hogya bhai." (  user access token invalidated )


3. Frontend logic :: Detects 401 ➔ Automatically calls a special API ( resource access krwana chah rha hai  )


code to access an endpoint, refresh his access token from there, and get a new token.

Get new access token and retry original request


```bash
// Example pseudo code
if (response.status === 401) {
    await fetch('/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',  
        // to send cookies (refresh token)
    });
}
```


4. Frontend sends Refresh Token to /auth/refresh-token endpoint:

     - Refresh token backend me stored hai (DB/session store me).

     - Frontend ➔ Request me cookies ke through ya body me bhejta hai.


```bash
POST /auth/refresh-token
Cookie: refresh_token=<refresh_token>
```

5. Refresh Token ko DB/session store me check karega:

    - Agar match hua ➔ New Access Token banayega + New Refresh Token banayega.

    - Agar match nahi ➔ 403 ya logout kara dega (possible token theft).


6. Backend responds:

    - New Access Token ➔ Cookies me ya response body me bhejta hai.

    - Refresh Token ➔ Rotate krke (naya generate karke) cookie + DB me update kar deta hai.


7.  Frontend uses new Access Token:

     - Jo resource user maang raha tha ➔ Ab phir se new Access Token ke saath request jaati hai.

     - User ko koi manual login karne ki zaroorat nahi padti.




 Important Concept 

   - Refresh Token stored in DB (session concept)

   - Refresh Token in cookie (httpOnly)

   - Access Token expired ➔ refresh with Refresh Token


8. Har bar jab Refresh Token se naya Access Token banta hai:

   - Refresh Token ko bhi rotate (change) karo.

   - Old Refresh Token invalid ho jaye (so agar koi chori kare toh use na kar paye).


```bash

1. Access Token expire ➔ 401 aaya
2. Frontend ➔ /auth/refresh-token endpoint ko hit karta hai
3. Refresh Token verify hota hai backend pe
4. Naya Access Token + Naya Refresh Token milta hai
5. Frontend phir se resource fetch karta hai new token se

```

---------------------------------------------------


1. ek endpoint jaha pr user apna token refresh kra payein

    - Haan, technically refresh token "user" (frontend) bhejta hai request me.

    - Lekin! Best practice me user ko refresh token directly dikhaya ya JS me accessible nahi kiya jaata.

    - Isko hum httpOnly secure cookies me save krte hain, jo browser automatically request me bhejta hai, bina frontend JS code ko dikhaye.



Jab user login krta hai ➔ backend:

   - Access Token ➔ response me ya cookie me deta hai.

   - Refresh Token ➔ httpOnly cookie me set krta hai (ye frontend JS ko dikhega bhi nahi).


---------------------------------------------------



1. User login krta hai (email/password)

2. Backend kya karta hai?

      - Access Token (short-lived) banata hai.

      - Refresh Token (long-lived) banata hai aur DB me save karta hai (user ID ke sath).


3. Backend Tokens kaise frontend ko bhejta hai?
  
      - Access Token ➔ Cookie me (agar cookie based auth use kr rahe ho)

      - Ya frontend me directly bhejke memory me rakhne ko bolta hai.

      - Refresh Token ➔ HttpOnly Cookie me bhejta hai (ye safe hai)


Note: Refresh Token kabhi bhi JS code me nahi aata ➔ ye httpOnly hone ki wajah se browser khud request me send karta hai.



4. Jab Access Token Expire Ho Jaata Hai (401 Error pe)

    - Frontend koi protected API call krta hai:

        - Lekin Access Token expire hone ki wajah se 401 Unauthorized aata hai.

    - Frontend kya karega?

        - Ek special API ko call karega ➔ /auth/refresh-token

         - Credentials: 'include' lagayega taaki browser refresh token cookie ko backend ko bhejega


Backend Token Refresh Flow

1. Backend ko refresh token mila browser se (cookie me).

2. Backend:

    - DB me check karega :: "Kya ye refresh token valid hai is user ke liye?"

3. Agar refresh token match ho jaata hai:

     - Naya Access Token banata hai (short-lived)

     - Naya Refresh Token bhi banata hai (rotate krta hai) aur DB me update kr deta hai.

     - Naya Refresh Token fir se httpOnly cookie me set krta hai.

4. Frontend:

Naya access token milte hi phir se protected APIs call krne lagta hai — bina user ko login kraye.


 