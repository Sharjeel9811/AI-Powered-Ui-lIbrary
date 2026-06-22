
import jwt from 'jsonwebtoken';


export const ISAuth=async(req,res,next)=>{

  try {

    let {token}=req.cookies;

    if(!token){
      return res.status(401).json({
        message:"Not Aunthenticated"
      })
    }

    const verfifytoken=jwt.verify(token,process.env.JWT_SECRET);


    req.userId=verfifytoken.id;

    next();


  } catch (error) {
    return res.status(401).json({
      message:"Invalid Token"
    })
  }
}


