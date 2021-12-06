import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  getPost,
  getNewPost,
  getEditPost,
  selectIsLoading,
} from '../../redux/reducers/postReducer'
import { selectUser } from '../../redux/reducers/userReducer'
import MDEditor from '@uiw/react-md-editor'
import LoadingPage from '../LoadingPage'
import {
  NewPostContainer,
  NewPostTitle,
  NewPostTitleInput,
  NewPostBody,
  NewPostButton,
  ErrorMessage,
} from './NewPostPageStyle'

function NewPostPage({ edit }) {
  const isEdit = edit === 'edit'
  const { editId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectIsLoading)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const history = useHistory()

  useEffect(() => {
    (async () => {
      if (!user) return history.push('/')

      if (isEdit) {
        const data = await dispatch(getPost(editId))
        setTitle(data.title)
        setContent(data.body)
        return
      }
    })()
  }, [])

  const handleTitleInput = (e) => {
    setTitle(e.target.value)
  }

  const handleInputFocus = () => {
    setErrorMessage(null)
  }

  const handleSendPost = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!title || !content) return setErrorMessage('未確實填寫')

    if (isEdit) {
      dispatch(getEditPost(history, editId, title, content))
    } else {
      dispatch(getNewPost(history, title, content))
    }
  }

  return (
    <>
      {isLoading && <LoadingPage />}
      <NewPostContainer>
        <NewPostTitle>
          <NewPostTitleInput
            value={title}
            onFocus={handleInputFocus}
            onChange={handleTitleInput}
            placeholder="輸入標題..."
          />
        </NewPostTitle>
        <NewPostBody>
          <MDEditor
            value={content}
            height={300}
            textareaProps={{
              placeholder: 'Please enter Markdown text',
            }}
            onChange={setContent}
          />
        </NewPostBody>
        <NewPostButton onClick={handleSendPost}>送出</NewPostButton>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </NewPostContainer>
    </>
  )
}

NewPostPage.propTypes = {
  edit: PropTypes.string,
}

export default NewPostPage
