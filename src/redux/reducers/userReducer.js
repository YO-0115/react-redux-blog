import { createSlice } from '@reduxjs/toolkit'
import { setAuthToken } from '../../utils'
import { fetchRegister, fetchLogin, fetchGetMe } from '../../WebAPI'

export const userReducer = createSlice({
  name: 'users',
  initialState: {
    isUserLoading: false,
    user: null,
    errorMessage: null,
  },
  reducers: {
    setIsUserLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setUser: (state, action) => {
      state.user = action.payload
    },

    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload
    },
  },
})

export const { setIsUserLoading, setUser, setErrorMessage } =
  userReducer.actions

export const register = (history, nickname, username, password) => async (dispatch) => {
  dispatch(setErrorMessage(null))
  dispatch(setIsUserLoading(true))
  try {
    const response = await fetchRegister(nickname, username, password)
    if (response.ok !== 1) {
      dispatch(setErrorMessage(response.message))
      return
    }
    setAuthToken(response.token)
    dispatch(getMe())
    dispatch(setIsUserLoading(false))
    history.push('/')
  } catch (err) {
    console.log(err)
  }
}

export const login = (history, username, password) => async (dispatch) => {
  dispatch(setErrorMessage(null))
  dispatch(setIsUserLoading(true))
  try {
    const response = await fetchLogin(username, password)
    if (response.ok !== 1) {
      dispatch(setErrorMessage(response.message))
      return
    }
    setAuthToken(response.token)
    dispatch(getMe())
    dispatch(setIsUserLoading(false))
    history.push('/')
  } catch (err) {
    console.log(err)
  }
}

export const getMe = () => async (dispatch) => {
  try {
    const response = await fetchGetMe()
    if (response.ok !== 1) {
      setAuthToken(null)
      dispatch(setErrorMessage(response.toString()))
      return
    }
    dispatch(setUser(response.data))
    return response
  } catch (err) {
    console.log(err)
  }
}

export const clearErrorMessage = () => (dispatch) => {
  dispatch(setErrorMessage(null))
}

export const logout = () => (dispatch) => {
  setAuthToken('')
  dispatch(setUser(null))
}

export const selectIsUserLoading = (store) => store.users.isUserLoading
export const selectUser = (store) => store.users.user
export const selectErrorMessage = (store) => store.users.errorMessage

export default userReducer.reducer
