import axios from 'axios'
import { Component } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ServerUrl } from '../App'
import Auth from '../Components/Auth'
import Footer from '../Components/Footer'
import Hero from '../Components/Hero'
import Inside from '../Components/Inside'
import Work from '../Components/Work'
import { setuserData } from '../Redux/UserSlice'

const Home = () => {
  const [showAuth, setShowAuth] = useState(false)
  const dispatch = useDispatch()

  const Logout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setuserData(null))
      setShowAuth(true)
      setprofileOpen(false)
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  const [profileOpen, setprofileOpen] = useState(false)

  const UserData = useSelector((state) => state.user.userData);

  useEffect(() => {
    console.log('Home.jsx UserData:', UserData)
  }, [UserData])

  const formatName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };
  return (
    <div className='min-h-screen bg-[#030b0d] text-white '>

    <div className='fixed inset-0 bg-[radial-gradient(circle,rgba(59,232,255,0.025)_1px,transparent_1px)] bg-size-[28px_28px] pointer-events-none'/>

    <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }} className='sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 lg:px-10 py-4 border-b border-white/5 bg-[#030b0d]/85 backdrop-blur-md'>
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className='flex items-center gap-2'>
        <div className='px-2 py-1 bg-cyan-400 rounded-2xl  '>
          <img src="./img.png" alt="" className='w-10 h-10' />
        </div>
        <span className='text-2xl font-bold tracking-tight'>Virtual Ui</span>
      </motion.div>


    <div className='hidden md:flex relative items-center gap-6 lg:gap-8 text-sm  text-white/50'>

    <button className='hover:text-white transition-colors duration-200 cursor-pointer bg-transparent w-full px-6 py-1.5 border border-white/15 rounded-xl'>Components</button>
    {UserData && UserData.name && UserData.email ? (
      <div className='relative'>
        <button
          onClick={() => setprofileOpen(!profileOpen)}
          className='h-9 w-9 flex items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-semibold shadow-sm transition-transform hover:scale-105 cursor-pointer'
          aria-label='Open profile menu'
          title='Open profile menu'
        >
          <span className='select-none'>{formatName(UserData.name)}</span>
        </button>

      </div>
    ) : (
      <div className='relative'>
        <button
          onClick={() => setShowAuth(true)}
          aria-label='Open menu'
          title='Open menu'
          className='inline-flex items-center gap-3 px-2 py-1 rounded-md bg-linear-to-r from-cyan-400 to-blue-500 text-slate-900 font-semibold shadow-lg hover:from-cyan-500 hover:to-blue-600 transform transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 active:scale-95 cursor-pointer'
        >
          <span className='flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm'>
            <Component className='w-4 h-4 text-white' />
          </span>
          <span className='whitespace-nowrap'>Generate AI Components</span>
        </button>
      </div>
    )}
    {profileOpen ? (
      <div className='absolute right-0 top-full mt-2 w-fit min-w-55 rounded-lg border border-white/10 bg-[#071317]/95 shadow-lg text-sm overflow-hidden transform transition ease-out duration-150 origin-top-right'>
        {UserData ? (
          <div className='py-2'>
            <div className='px-4 flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center font-semibold'>{formatName(UserData.name)}</div>
              <div className='min-w-0'>
                <div className='font-semibold truncate'>{UserData?.name}</div>
                <div className='text-xs text-white/60 truncate'>{UserData?.email}</div>
              </div>
            </div>

            <div className='mt-3 border-t border-white/5' />

            <div className='py-1'>
              <button className='w-full text-left px-4 py-2 hover:bg-white/5 transition-colors flex items-center gap-3'>Profile</button>
              <button className='w-full text-left px-4 py-2 hover:bg-white/5 transition-colors flex items-center gap-3'>Settings</button>
              <button onClick={() => Logout()} className='w-full text-left px-4 py-2 hover:bg-red-600/20 text-red-400 transition-colors flex items-center gap-3'>Logout</button>
            </div>
          </div>
        ) : (
          <div className='p-2'>
            <button onClick={() => { setShowAuth(true); setprofileOpen(false); }} className='w-fit inline-flex items-center rounded-md px-4 py-2 hover:bg-white/5 transition-colors'>Get Started</button>
          </div>
        )}
      </div>
    ) : null}

    </div>



    </motion.nav>


    <Hero setauth={()=>setShowAuth(true)}/>
      <Inside/>
      <Work/>
    <Footer/>


      <AnimatePresence>
        {showAuth ? <Auth onClose={() => setShowAuth(false)} /> : null}
      </AnimatePresence>
    </div>

  )
}

export default Home
