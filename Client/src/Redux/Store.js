import { configureStore } from '@reduxjs/toolkit'
import userslice from './UserSlice'

export default configureStore({
  reducer: {
    user:userslice
  },
})
