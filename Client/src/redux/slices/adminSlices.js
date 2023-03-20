import { createSlice } from '@reduxjs/toolkit'

const AdminSlices = createSlice({
  name: 'admin',
  initialState: {
    admin: {},
    isLogin: false
  },
  reducers: {
    getAdminLogin: (state, action) => {
      state.isLogin = true
    },
    getAdminLogout: (state, action) => {
      state.isLogin = false
    },
    getAboutAdmin: (state, action) => {
      state.admin = action.payload
    }
  }
})

const { actions, reducer } = AdminSlices
export const { getAdminLogin, getAdminLogout, getAboutAdmin } = actions
export default reducer
