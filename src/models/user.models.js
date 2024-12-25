import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName:{
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar:{
      type:String, // cloudinary url
      required: true,
    },
    coverImage:{
      type:String // cloudinary url
    },
    watchHistory:[
      {
        type:Schema.Types.ObjectId,
        ref:"Video"
      }
    ],
    password:{
      type: String,
      required:[true,"Password is required"],
    },
    refreshTokens:{
      type: String
    }
  },{timestamps:true}
)

userSchema.pre("save", async function (next) {
  if(! this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password,10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET ,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User",userSchema)







// A JSON web token(JWT) is JSON Object which is used to securely transfer information over the web(between two parties). 
 
// It can be used for an authentication system and can also be used for information exchange. The token is mainly composed of header, payload, signature. These three parts are separated by dots(.). 

// JWT defines the structure of information we are sending from one party to the another, 

// and it comes in two forms – Serialized, Deserialized. The Serialized approach is mainly used to transfer the data through the network with each request and response. While the deserialized approach is used to read and write data to the web token.