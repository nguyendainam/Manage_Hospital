import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlices from './slices/userSlices'
import adminSlies from './slices/adminSlices'

const rootReducer = combineReducers({
  user: userSlices,
  admin: adminSlies
})

const store = configureStore({
  reducer: rootReducer
})
export default store
