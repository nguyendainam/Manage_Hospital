import { createSlice } from '@reduxjs/toolkit'

export const AdminSlices = createSlice({
  name: 'admin',
  initialState: {
    admin: '',
    isLogin: false,
    allHospitals: {}
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
    },
    fetchAllHospitals: (state, action) => {
      state.allHospitals = action.payload
    }
  }
})

// const { actions, reducer } =
export const {
  getAdminLogin,
  getAdminLogout,
  getAboutAdmin,
  fetchAllHospitals
} = AdminSlices.actions

export default AdminSlices.reducer
