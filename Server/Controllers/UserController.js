import jwt from 'jsonwebtoken';
import User from "../Models/UserModel.js";



export const getCurrentUser=async(req,res)=>{
  try {
    const { token } = req.cookies || {};

    if (!token) {
      return res.status(200).json({
        message: 'No active session',
        user: null
      });
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyError) {
      return res.status(200).json({
        message: 'No active session',
        user: null
      });
    }

    const user=await User.findById(decodedToken.id);

    if(!user){
      return res.status(200).json({
        message: 'No active session',
        user: null
      })
    }
    return res.status(200).json({
      message:"User Found",
      user
    })

  } catch (error) {
    return res.status(500).json({message:"Failed to Fetch User",error:error.message})
  }
}

