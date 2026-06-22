
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import { Copy, Download, Settings, Sparkle, X } from 'lucide-react'
import { easeInOut, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ServerUrl } from '../App'
import { setuserData } from '../Redux/UserSlice'
import { Authentication, provider } from '../utils/Firebase'

const Auth = ({ onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const steps=[
    {
      icon: <FcGoogle size={28} />,
      title: 'Sign in with Google',
      description: 'Click the sign-in button to continue with your Google account.'

    }
    ,
    {
      icon:<Sparkle size={28} />,
      title:'Get 150 Ai Credits',
      description:'Receive 150 AI credits to explore and utilize our virtual UI library.'
    }
    ,{
      icon:<Settings size={28} />,
      title:'Customize Props',
      description:'Easily customize component properties to fit your design needs.'
    },
    {
      icon:<Copy size={28} />,
      title:'Copy Code',
      description:'Effortlessly copy the generated code for seamless integration into your projects.'
    }
    ,{
      icon:<Download size={28} />,
      title:'Download Assets',
      description:'Download assets and resources to enhance your development workflow.'
    }

  ];
  const [active, setactive] = useState(0)

  const stepsContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  }

  const stepItem = {
    hidden: { opacity: 0, y: 8, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    },
  }

  useEffect(() => {
    const id = setInterval(() => {
      setactive((s) => (s + 1) % steps.length)
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [steps.length])


  const GoogleAuth=async()=>{
    try {
const response =await signInWithPopup(Authentication,provider)
let User=response.user;
let name=User.displayName;
let email=User.email;


const Data =await axios.post(`${ServerUrl}/api/auth/google`,{name,email},{withCredentials:true});

console.log(Data.data);
// update client state and navigate home
try {
  const user = Data.data.user || Data.data
  dispatch(setuserData(user))
  if (onClose) onClose()
  navigate('/')
} catch {
  // no-op if redux not available
}


    } catch (error) {
      console.error("Google Authentication Failed:", error.message)

    }
  }





  return (


    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md'
    >
      <motion.div
        initial={{ y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 18, scale: 0.98, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, mass: 0.9 }}
        className='relative flex w-[min(92vw,960px)] h-[min(84vh,620px)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#071317]/95 shadow-[0_30px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/5 sm:flex-row sm:items-stretch'
      >
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(127,243,255,0.12),transparent_35%)]' />
        <button
          type='button'
          aria-label='Close auth popup'
          className='absolute right-4 top-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white'
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Left Box */}
        <div className='relative flex min-h-0 flex-col overflow-hidden bg-linear-to-br from-[#2a1016] via-[#0c1a20] to-[#041e24] p-5 sm:w-[48%] sm:p-6'>
          <motion.div aria-hidden className='pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-linear-to-br from-cyan-500/5 via-transparent to-pink-500/4 blur-3xl opacity-70' animate={{ rotate: [0, 3, -2, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          <div className='pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,232,255,0.55)_0%,transparent_72%)] blur-2xl' />
          <div className='pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl' />

          <div className='flex items-center gap-3'>
            <img src="/img.png" alt=""  className='h-7 w-7 '/>
          <p className='text-[11px] uppercase tracking-[0.26em] text-cyan-400 '>Virtual UI Library</p>



          </div>
           <p className='mt-3 text-[11px] uppercase tracking-[0.22em] text-cyan-400'>How It Works</p>



        <motion.div variants={stepsContainer} initial="hidden" animate="show" className='mt-3 flex flex-col gap-2'>
        {steps.map((step,index)=>(
          <motion.div key={index} variants={stepItem} className={`flex items-start gap-2.5 rounded-lg p-2.5 transition-colors transform ${active===index?'bg-cyan-400/20 backdrop-blur-2xl scale-100':'hover:-translate-y-0.5'} cursor-pointer`}>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white shadow-lg shadow-black/80'>
              {step.icon}
            </div>
            <div>
              <p className='text-[13px] font-semibold leading-5 text-white'>{step.title}</p>
              <p className='text-[11px] leading-4 text-white/80'>{step.description}</p>
            </div>
          </motion.div>

        ))}
        </motion.div>











        </div>

    
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className='relative flex flex-1 flex-col items-center justify-center gap-4 bg-[#071317] p-6 sm:p-8'
        >
          <motion.div animate={{y:[0,-6,0]}} transition={{duration:3,repeat:Infinity,ease:easeInOut}} className='flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-cyan-300 shadow-inner shadow-black/20'>
            <FcGoogle size={24} />
          </motion.div>

          <div  className='grid grid-cols-3 gap-4 text-center mt-5'>

            <div className='flex flex-col items-center justify-center'>
              <p className='text-base font-bold text-cyan-500'>
                150
              </p>
              <p className='font-bold text-white'>AI Credits</p>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <p className=' font-bold text-cyan-500 text-base'>
                100+
              </p>
              <p className='font-bold text-white'>Components</p>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <p className='font-bold text-cyan-500 text-base'>
                Ready
              </p>
              <p className='font-bold text-white'>To Use</p>

            </div>




          </div>

          <p className='max-w-xs text-center text-[13px] leading-5 text-white/65'>Click the sign-in button to continue with your Google account.</p>

          <div>


          </div>

          <motion.button onClick={GoogleAuth}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className='group flex items-center gap-3 rounded-full border border-white/10 bg-white/95 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:bg-white hover:shadow-[0_16px_38px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-[#7ff3ff]/60 focus:ring-offset-2 focus:ring-offset-[#071317]'
          >
            <span className='flex px-4 py-1 items-center justify-center rounded-full bg-slate-50 shadow-inner ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105 group-hover:-translate-x-1'>
              <FcGoogle size={22} />
            </span>
            <span className='tracking-wide'>Sign in with Google</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Auth

