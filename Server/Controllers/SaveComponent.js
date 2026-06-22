import componentModel from "../Models/ComponentModel.js";
import User from "../Models/UserModel.js";



export const SaveComponet=async(req,res)=>{

  try {
const {name,code,props,visibility='private',npmPackage=''}=req.body;

if(!name || !code){
  return res.status(400).json({message:'Name and code are required'})
}


const user=await User.findById(req.userId);

if(!user){
  return res.status(404).json({
    message:'User not found'
  })
}

const existingPublicComponent=await componentModel.findOne({visibility:'public',name:name});
const existingOwnedComponent=await componentModel.findOne({owner:req.userId,name:name});

if (user.role==='admin'){
  if(visibility==='public' && existingPublicComponent){
    return res.status(400).json({message:'A public component with this name already exists. Please choose a different name.'})
  }
}

if(user.role==='user'){
  if(existingOwnedComponent || existingPublicComponent){
    return res.status(400).json({message:'You already have a component with this name, or a public component with this name exists. Please choose a different name.'})
  }
}



const component=new componentModel({
  name:name,
  code:code,
  props:props,
  owner:req.userId,
  visibility,
  npmPackage,

})

await component.save();


return res.status(201).json({
  message:'Component saved successfully',
  component:component
})



  } catch (error) {
    console.error("Error in SaveComponent controller:",error);
    return res.status(500).json({message:'Server error'})

  }
}
