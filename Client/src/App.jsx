import axios from 'axios'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes, useLocation } from 'react-router-dom'
import PageWrapper from './Components/PageWrapper'
import Generate from './Pages/Generate'
import Home from './Pages/Home'
import { setuserData } from './Redux/UserSlice'

export const ServerUrl=import.meta.env.VITE_SERVER_URL || ""


const App = () => {
  const dispatch = useDispatch();
  const location = useLocation()


  useEffect(()=>{

    const fetchUserData=async()=>{
      try {
        const UserData=await axios.get(`${ServerUrl}/api/user/current`,{withCredentials:true});

        dispatch(setuserData(UserData.data.user));
      } catch (error) {
        console.log("Failed to Fetch User Data",error.message);

      }

    }
    fetchUserData();


  },[dispatch])
  return (
    <AnimatePresence mode='wait' initial={true}>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
        <Route path='/generate' element={<PageWrapper><Generate /></PageWrapper>} />
        {/* Fallback: redirect any unknown path to Home to avoid blank pages */}
        <Route path='*' element={<PageWrapper><Home /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default App

