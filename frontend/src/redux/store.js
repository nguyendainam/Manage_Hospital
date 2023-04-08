import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlices from './slices/userSlices'
import adminSlices from './slices/adminSlices'
import systemSlices from './slices/systemSlices'

const rootReducer = combineReducers({
  user: userSlices,
  admin: adminSlices,
  system: systemSlices
})

const store = configureStore({
  reducer: rootReducer
})
export default store
