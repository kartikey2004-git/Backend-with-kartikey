- encryption directly not possible we can decrypt with help of mongoose hooks


- Pre middleware functions are executed one after another, when each middleware calls next


- Agar tum kisi data ke save hone se just pehle koi logic run karwana chahte ho ya code execute krwa skte h ( jaise password encryption ) — jaise ki user ne koi controller ya API call diya ho uske baad — toh "pre hooks" ka use hota hai.


- Schema mein jo pre hook hota hai usme callback normal function ki tarah likhte hai , not like arrow function kyuki arrow function mein this ka reference nhi hota hai / context ka patab nhi hota hai arrow function mein


- Arrow function mein this ka reference hota hai lexical (outer scope ka), jabki Mongoose hook ke andar this ka reference us document ka hota hai jo abhi save/update ho raha hai.



- encryption is complex process --> encryption mein algorithm chalti hai --> CPU processing hoti hai so it takes time


- next ek callback function hota hai jo batata hai ki ab ye middleware ka kaam complete ho gaya hai, ab aage badho — yaani ki agla middleware ya actual save() operation ab run ho sakta hai.



Jab next() call karte ho:
   - Mongoose ko signal milta hai ki tumhara hook ka kaam complete ho gaya hai, ab operation continue kar sakte ho.


Agar next() call nahi karoge:
Toh process wahi ruk jaayega — ya toh data save hi nahi hoga ya application hang/timeout kar jaayegi. 



but there is difficulty ki jab bhi data save hoga toh ye password ko hash krega , again and again agar humne kuch bhi avatar bhi change kra toh bhi yeh password change krdega 



agar har baar save() call hone pe password dubara hash ho jaaye, even when password ko change hi nahi kiya gaya, toh wo galat behavior hoga.


solution : Check if the password is modified
if yes tabhi code execute ho wrna skip krde password encryption

   - 1st time jab password save kra rhe honge
   - jab password update hoga or new password set krna chahu tab ho 


--------------------------------------------------



What bcrypt actually does bts?




1. Salt generate karta hai

- Ek random string (salt) generate hoti hai.
- Salt ensures that same password → different hash.

- So, kartikey123 for user A ≠ kartikey123 for user B




2. Password + Salt combine karta hai

    Ye combination ko process karta hai using a computationally expensive algorithm.



3. Hash generate karta hai


- Ye hash irreversible hota hai (one-way encryption).

- Even bcrypt ko khud bhi original password nahi pata hota.




4. Security through Slowness

Intentionally slow banaya gaya hai to defend against brute-force attacks.

You can control how slow via saltRounds (default: 10)



--------------------------------------------------


jab user login karta hai, toh user plain password bhejta hai, lekin database mein password toh encrypted (hash) form mein hota hai.


bcrypt is one-way encryption.
hash → original password ka koi direct reverse nahi hai.



1.  bcrypt.compare() kya karta hai?

- plainPassword ko same salt algo se hash karta hai.
- Phir dono hash values ko compare karta hai.




- Mongoose mein pre hooks aur schema.methods dono ke paas this hota hai, aur wo this refer karta hai document (object / current user) ko jisme data hai.


cryptography - computational power use hoti hai toh time lagta hai


--------------------------------------------------


JWT (JSON Web Token) ek Bearer Token hota hai, aur jiske paas ye token hai, use trusted maana jaata hai — that's why it's called a "bearer" token. ( strong security h iski )


JWT as Bearer Token
   - Jab user login karta hai, backend ek JWT token generate karta hai.
   - Ye token sign kiya gaya hota hai secret se (like a digital signature).

   - Ab yeh token user ke paas store ho jaata hai (localStorage, cookie, etc).

   - Jab user future mein koi protected API hit karta hai, wo token bhejta hai

"Iske paas valid JWT hai, matlab yeh authorized user hai."



JWT token:

   - Encrypted nahi hota, but signed hota hai.

   - Iska matlab token ka data (payload) decode ho sakta hai, but tamper ( interfere with (something) in order to cause damage ) nahi ho sakta bina signature tod ke.


backend verify karta hai token ko har request pe

Token ko kabhi frontend JS se expose mat karo

Prefer httpOnly cookies for better security (especially in prod)

------------------------------------------------------------

jwt.sign method token generate krta hai

sign requires
 - payload 
 - object 
 - buffer
 - secret 
 -signInOptions


Sign asynchronously
```bash
jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
```

Backdate a jwt 30 seconds 

```bash
jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 },
```


Signing a token with 1 hour of expiration

```bash
jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');
```


ACCESS_TOKEN_SECRET in env variable

- complex string generate krte hai phir likhte hai in production grade ( strong secret hona chahiye )

- Algorithm to generate Access token like SHA algorithm


- but hum khali refresh token save kr rhe hai user table mein databse mein 

we use sessions or cookies ( kaafi security ke sath ja rhe hai )

access token database mein store nhi hoga 