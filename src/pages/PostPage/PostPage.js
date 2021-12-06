import React, { useLayoutEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import MDEditor from '@uiw/react-md-editor'
import Comments from '../../components/Comments'
import LoadingPage from '../LoadingPage'
import {
  getPost,
  selectIsLoading,
  selectPost,
  deletePost,
  getUserPosts,
} from '../../redux/reducers/postReducer'
import { selectUser } from '../../redux/reducers/userReducer'
import {
  PostContainer,
  EditButton,
  DeleteButton,
  PostTitle,
  PostBody,
  PostInfo,
  PostAuthor,
  PostCreatedAt,
  PostContent,
} from './PostPageStyle'

function PostPage({ currentTheme }) {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectIsLoading)
  const post = useSelector(selectPost)

  useLayoutEffect(() => {
    dispatch(getPost(id))
    window.scrollTo(0, 0)
  }, [id, dispatch])

  const handleDelete = async () => {
    await dispatch(deletePost(id))
    await dispatch(getUserPosts(user.id))
    history.push('/posts-list')
  }

  return (
    <>
      {isLoading && <LoadingPage />}
      <PostContainer>
        <PostTitle>
          {post && post.title}
          {(post && post.userId) === (user && user.id) && (
            <>
              <EditButton to={`/edit-post/${post && post.id}`}>編輯</EditButton>
              <DeleteButton onClick={handleDelete}>刪除</DeleteButton>
            </>
          )}
        </PostTitle>
        <PostBody>
          <PostInfo>
            <PostAuthor>{post && post.user && post.user.nickname}</PostAuthor>
            <PostCreatedAt>
              {new Date(post && post.createdAt).toLocaleDateString()}
            </PostCreatedAt>
          </PostInfo>
          <PostContent>
            <MDEditor.Markdown source={post && post.body} />
          </PostContent>
        </PostBody>
        <hr />
        <Comments currentTheme={currentTheme} />
      </PostContainer>
    </>
  )
}

PostPage.propTypes = {
  currentTheme: PropTypes.string,
}

export default PostPage
