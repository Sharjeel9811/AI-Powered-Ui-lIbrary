import mongoose, { trusted } from "mongoose";



const userSchema=new mongoose.Schema({

  name:{
    type:String,
    require:true

  },
  email:{
    type:String,
    require:true,
    unique:true
  },
  role:{
    type:String,
    enum:["admin","user"],
    default:"user"
  }
  ,
  aicredits:{
    type:Number,
    default:150
  }
},{timestamps:true})


const User=mongoose.model("User",userSchema)

export default User;
