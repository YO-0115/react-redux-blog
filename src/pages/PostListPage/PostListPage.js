import React, { useLayoutEffect, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  getPostList,
  getUserPosts,
  selectIsLoading,
  selectPostList,
} from '../../redux/reducers/postReducer'
import { selectUser } from '../../redux/reducers/userReducer'
import LoadingPage from '../LoadingPage'
import {
  PostContainer,
  PostTitle,
  PostDate,
  PostList,
  ButtonWrapper,
  PostListButton,
  Span,
  YearContainer,
  Year,
} from './PostListPageStyle'

function Post({ post }) {
  return (
    <PostContainer to={`/posts/${post.id}`}>
      <PostTitle>{post.title}</PostTitle>
      <PostDate>
        {new Date(post.createdAt).toLocaleDateString().substring(5, 10)}
      </PostDate>
    </PostContainer>
  )
}

Post.propTypes = {
  post: PropTypes.object,
}

function PostListPage({ isUser }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectIsLoading)
  const postList = useSelector(selectPostList)
  const [postState, setPostState] = useState('allPosts')
  const [years, setYears] = useState([])

  useLayoutEffect(() => {
    if (isUser) {
      if (user) {
        const userId = user.id
        dispatch(getUserPosts(userId))
        setPostState('myPosts')
        return
      }

      dispatch(getPostList())
    }
  }, [isUser, dispatch])

  useEffect(() => {
    const yearsArray = []
    for (const post of postList) {
      yearsArray.push(new Date(post.createdAt).getFullYear())
    }

    setYears([...new Set(yearsArray)])
  }, [postList])

  const handleAllPosts = () => {
    setPostState('allPosts')
    dispatch(getPostList())
  }

  const handleUserPosts = () => {
    setPostState('myPosts')

    const userId = user.id
    dispatch(getUserPosts(userId))
  }

  return (
    <>
      {isLoading && <LoadingPage />}
      <PostList>
        {user && (
          <ButtonWrapper>
            {postState === 'allPosts' && (
              <>
                <PostListButton $active onClick={handleAllPosts}>
                  all posts
                </PostListButton>
                <Span>/</Span>
                <PostListButton onClick={handleUserPosts}>
                  my posts
                </PostListButton>
              </>
            )}
            {postState === 'myPosts' && (
              <>
                <PostListButton onClick={handleAllPosts}>
                  all posts
                </PostListButton>
                <Span>/</Span>
                <PostListButton $active onClick={handleUserPosts}>
                  my posts
                </PostListButton>
              </>
            )}
          </ButtonWrapper>
        )}
        {years.map((year, index) => {
          return (
            <YearContainer key={index}>
              <Year>{year}</Year>
              {postList
                .filter(
                  (post) => new Date(post.createdAt).getFullYear() === year
                )
                .map((post) => (
                  <Post key={post.id} post={post} />
                ))}
            </YearContainer>
          )
        })}
      </PostList>
    </>
  )
}

PostListPage.propTypes = {
  isUser: PropTypes.bool,
}

export default PostListPage
