import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  login,
  clearErrorMessage,
  selectErrorMessage,
  selectIsUserLoading,
} from '../../redux/reducers/userReducer'
import LoadingPage from '../LoadingPage'
import {
  FormContainer,
  FormTitleButton,
  FormInfo,
  FormInput,
  FormText,
  ErrorMessage,
} from '../../style/formStyle'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()
  const errorMessage = useSelector(selectErrorMessage)
  const isUserLoading = useSelector(selectIsUserLoading)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(history, username, password))
  }

  const handleUsernameInput = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordInput = (e) => {
    setPassword(e.target.value)
  }

  const handleInputFocus = () => {
    dispatch(clearErrorMessage())
  }

  return (
    <>
      {isUserLoading && <LoadingPage />}
      <FormContainer onSubmit={handleSubmit}>
        <FormTitleButton>登入</FormTitleButton>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <FormInfo>
          <FormText>username</FormText>
          <FormInput
            value={username}
            onChange={handleUsernameInput}
            onFocus={handleInputFocus}
          />
        </FormInfo>
        <FormInfo>
          <FormText>password</FormText>
          <FormInput
            type="password"
            value={password}
            onChange={handlePasswordInput}
            onFocus={handleInputFocus}
          />
        </FormInfo>
      </FormContainer>
    </>
  )
}

export default LoginPage
