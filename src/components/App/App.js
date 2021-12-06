import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../../style/globalStyle'
import { theme } from '../../style/style'
import Header from '../Header'
import HomePage from '../../pages/HomePage'
import PostListPage from '../../pages/PostListPage'
import PostPage from '../../pages/PostPage'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import NewPostPage from '../../pages/NewPostPage'
import AboutPage from '../../pages/AboutPage'
import { getMe } from '../../redux/reducers/userReducer'
import { getAuthToken, getTheme } from '../../utils'

const Root = styled.div`
  padding-top: 64px;
`

function App() {
  const dispatch = useDispatch()
  const [isUser, setIsUser] = useState(null)
  const [currentTheme, setCurrentTheme] = useState(getTheme())

  useEffect(() => {
    (async () => {
      setIsUser(false)
      const getToken = getAuthToken()
      if (!getToken) return setIsUser(true)

      const response = await dispatch(getMe())
      if (response) {
        setIsUser(true)
      }
    })()
  }, [])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Root>
        <Router>
          <GlobalStyle />
          <Header
            isUser={isUser}
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/posts-list">
              <PostListPage isUser={isUser} />
            </Route>
            <Route path="/posts/:id">
              <PostPage currentTheme={currentTheme} />
            </Route>
            <Route path="/new-post">
              <NewPostPage />
            </Route>
            <Route path="/edit-post/:editId">
              <NewPostPage edit="edit" />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
          </Switch>
        </Router>
      </Root>
    </ThemeProvider>
  )
}

export default App
