import React, { useState, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import MDEditor from '@uiw/react-md-editor'
import {
  getPostPage,
  selectPostPage,
  selectIsLoading,
} from '../../redux/reducers/postReducer'
import Paginator from './Paginator'
import LoadingPage from '../LoadingPage'
import {
  HomePostContainer,
  HomePostTitle,
  HomePostAuthor,
  HomePostDate,
  HomePostBody,
  HomePostList,
} from './HomePageStyle'

function HomePost({ post }) {
  return (
    <HomePostContainer>
      <HomePostTitle to={`/posts/${post.id}`}>{post.title}</HomePostTitle>
      <HomePostAuthor>{post.user && post.user.nickname}</HomePostAuthor>
      <HomePostDate>
        {new Date(post.createdAt).toLocaleDateString()}
      </HomePostDate>
      <HomePostBody>
        <MDEditor.Markdown source={post.body} />
      </HomePostBody>
    </HomePostContainer>
  )
}

HomePost.propTypes = {
  post: PropTypes.object,
}

function HomePage() {
  const dispatch = useDispatch()
  const postPage = useSelector(selectPostPage)
  const isLoading = useSelector(selectIsLoading)
  const [page, setPage] = useState(1)
  const [totalPostPages, setTotalPostPages] = useState(0)
  const [isPaginationLoading, setIsPaginationLoading] = useState(null)

  useLayoutEffect(() => {
    (async () => {
      setIsPaginationLoading(false)
      const data = await dispatch(getPostPage(page))
      setTotalPostPages(Math.ceil(data.total / 5))
      setIsPaginationLoading(true)
    })()

    window.scrollTo(0, 0)
  }, [page, totalPostPages])

  return (
    <>
      {isLoading && <LoadingPage />}
      <HomePostList>
        {postPage.map((post) => (
          <HomePost key={post.id} post={post} />
        ))}
        {isPaginationLoading && (
          <>
            {!!postPage.length && !!totalPostPages && (
              <Paginator
                page={page}
                setPage={setPage}
                totalPostPages={totalPostPages}
              />
            )}
          </>
        )}
      </HomePostList>
    </>
  )
}

export default HomePage
