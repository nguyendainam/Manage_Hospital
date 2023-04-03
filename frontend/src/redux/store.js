import {
  combineReducers,
  configureStore,
  getDefaultMiddleware
} from '@reduxjs/toolkit'
import userSlices from './slices/userSlices'
import adminSlices from './slices/adminSlices'
import systemSlices from './slices/systemSlices'

const rootReducer = combineReducers({
  user: userSlices,
  admin: adminSlices,
  system: systemSlices
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware()
})
export default store
