import { generateToken } from "../Configs/token.js";
import User from "../Models/UserModel.js";



export const Googleuth=async(req,res)=>{
  try {

    const {name,email}=req.body;

    if(!name||!email){
      return res.status(400).json({message:"Name and Email are required"})
    }
    let user=await User.findOne({
      email
    })
    if(!user){
      user=await User.create({
        name,email
      })
    }

    let token=generateToken(user._id);
    res.cookie("token",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"strict",
      maxAge:7*24*60*60*1000
    })


   return res.status(200).json({
      message:"Google Authentication Successfull",
      token,
      user
    })

  } catch (error) {
   return res.status(500).json({message:"Google Authentication Failed",error:error.message})
  }
}



export const logout=async(req,res)=>{
  try {
  await   res.clearCookie("token",{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"strict"
    })
  return   res.status(200).json({message:"Logout Successfull"})
  } catch (error) {
    return
res.status(500).json({message:"Logout Failed",error:error.message})
  }
}

