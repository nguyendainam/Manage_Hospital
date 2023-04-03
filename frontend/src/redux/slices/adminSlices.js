import { createSlice } from '@reduxjs/toolkit'

export const AdminSlices = createSlice({
  name: 'admin',
  initialState: {
    admins: [],
    isLogin: false,
    allHospitals: {},
    routeServer: ''
  },
  reducers: {
    getAdminLogin: (state, action) => {
      state.isLogin = true
    },
    getAdminLogout: (state, action) => {
      state.isLogin = false
    },
    getAboutAdmin: (state, action) => {
      return {
        ...state,
        admins: action.payload
      }
    },
    fetchAllHospitals: (state, action) => {
      state.allHospitals = action.payload
    },
    getRouteServer: (state, action) => {
      state.routeServer = action.payload
    }
  }
})

// const { actions, reducer } =
export const {
  getAdminLogin,
  getAdminLogout,
  getAboutAdmin,
  fetchAllHospitals,
  getRouteServer
} = AdminSlices.actions

export default AdminSlices.reducer
