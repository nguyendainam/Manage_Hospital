import { createSlice } from '@reduxjs/toolkit'
import { getDataAboutUser } from '../../services/userServices'

const userSlices = createSlice({
  name: 'user',
  initialState: {
    accounts: {},
    userList: [],
    isLogin: true,
    idPatient: '',
    selectedHos: '',
    dataUser: [],
    isUserLogin: false,
    dataPatients: []
  },
  reducers: {
    getUserList: (state, action) => {
      state.userList = action.payload
    },

    getAccounts: (state, action) => {
      state.accounts = action.payload
    },

    getLogin: (state, action) => {
      state.isLogin = true
    },
    getIdPatient: (state, action) => {
      state.idPatient = action.payload
    },
    getIdHospital: (state, action) => {
      state.selectedHos = action.payload
    },
    getDataUser_Slice: (state, action) => {
      return { ...state, dataUser: action.payload }
    },
    getLogginUser: (state, action) => {
      state.isUserLogin = true
    },

    getLogOutUser: (state, action) => {
      state.isUserLogin = false
    },
    getClearUser: (state, action) => {
      state.dataUser = []
    },
    getDataPatients: (state, action) => {
      return { ...state, dataPatients: action.payload }
    }
  }
})

export const getDataUser_Dispatch = data => async dispatch => {
  dispatch(getDataUser_Slice(data))
}

export const getDataPatients_Dispatch = email => async dispatch => {
  let getdata = await getDataAboutUser(email)
  if (getdata.data.errCode === 0) {
    let dataPatient = getdata.data.inforUser[0]
    dispatch(getDataPatients(dataPatient))
  }
}

const { actions, reducer } = userSlices
export const {
  getUserList,
  getAccounts,
  getLogin,
  getDataUser_Slice,
  getLogginUser,
  getLogOutUser,
  getClearUser,
  getDataPatients
} = actions
export default reducer
