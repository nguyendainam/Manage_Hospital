import { createSlice } from '@reduxjs/toolkit'
import { getIdDoctor_ByEmail } from '../../services/systemService'

export const AdminSlices = createSlice({
  name: 'admin',
  initialState: {
    admins: [],
    isLogin: false,
    allHospitals: {},
    routeServer: '',
    idDoctor: ''
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
    },

    getIdDoctor: (state, action) => {
      state.idDoctor = action.payload
    }
  }
})

export const fetchIdDoctor = (idServer, email) => async dispatch => {
  const getdata = await getIdDoctor_ByEmail(idServer, email)
  if (getdata.data.errCode === 0) {
    dispatch(getIdDoctor(getdata.data.idDoctor))
  } else {
    alert('Error from fetchIdDoctor ')
  }
}

// const { actions, reducer } =
export const {
  getAdminLogin,
  getAdminLogout,
  getAboutAdmin,
  fetchAllHospitals,
  getRouteServer,
  getIdDoctor
} = AdminSlices.actions

export default AdminSlices.reducer
