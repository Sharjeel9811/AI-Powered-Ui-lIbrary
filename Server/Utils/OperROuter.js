
import axios from "axios";

export const AskAi=async(messages)=>{

  try {

  if(!messages || messages.length===0){
    throw new Error("Messages array is empty")
  }

  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions',{
    model:'deepseek/deepseek-chat',
    messages:messages,
    max_tokens:2000,
    temperature:0.2,
    response_format:{ type:'json_object' }

  },{
    headers:{
      'Authorization':`Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
      'Content-Type':'application/json'
    }
  })

  const content = response?.data?.choices?.[0]?.message?.content;
  if(!content){
    throw new Error("No content found in response")
  }
  return content;


  } catch (error) {

    console.error("Error in AskAi function:",error);
    throw error;

  }



}
