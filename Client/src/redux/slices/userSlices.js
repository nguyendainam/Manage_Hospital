import { createSlice } from '@reduxjs/toolkit'

const userSlices = createSlice({
  name: 'user',
  initialState: {
    accounts: {},
    userList: [],
    isLogin: false
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
    }
  }
})

const { actions, reducer } = userSlices
export const { getUserList, getAccounts, getLogin } = actions
export default reducer
