
import { ArrowRight, Sparkle } from 'lucide-react'
import { easeInOut, motion } from 'motion/react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Hero = ({setauth}) => {
  const navigate=useNavigate();



  const userData=useSelector((state)=>state.user.userData);



  return (
  <div className='flex flex-col items-center mx-auto'>
    <motion.div initial={{opacity:0 , y:20}} animate={{opacity:1 , y:0}} transition={{
      duration:0.5,
      ease:[0.22, 1, 0.36, 1],
      delay:0.1
    }}

     className='mx-auto mt-4 border border-cyan-400 rounded-full '>
      <span className='flex items-center rounded-full px-4 py-2 gap-2'>
        <Sparkle className='text-cyan-400' size={20} />
        <span className='text-sm font-bold '>
          Ai Powered Ui Library
        </span>

      </span>

    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      className='mt-9 mx-auto max-w-4xl text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-white'
    >
      <span className=' text-white/95'>Build stunning UI components</span>
      <span className='block mt-2 text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-cyan-400 to-blue-500 drop-shadow-[0_8px_30px_rgba(34,211,238,0.28)]'>
        with the power of AI
      </span>
    </motion.h1>

    <motion.p className='text-gray-500 mt-3 mx-auto' initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 }} className='mt-6 text-sm text-center text-gray-400 max-w-3xl mx-auto'>
      Generate Components With the Help of AI
    </motion.p>


<div className='flex items-center gap-6 mt-6'>
   <motion.button onClick={setauth} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5, delay:0.3,ease:easeInOut}} className=' flex items-center bg-white px-3 py-2 rounded-md mt-6 text-sm font-semibold text-slate-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer'>
    Get Started
    <ArrowRight className='ml-2' size={16} />
  </motion.button>

  <motion.button  initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5, delay:0.3,ease:easeInOut}} className=' flex items-center bg-transparent  px-3 py-2 rounded-md mt-6 text-sm font-semibold text-white  transition-colors duration-200 cursor-pointer border border-white/20 hover:border-white/40' onClick={()=>userData && navigate('/generate')}>
    Generate Component
  </motion.button>
</div>


   </div>
  )
}

export default Hero
