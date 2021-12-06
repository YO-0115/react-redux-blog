import { createSlice } from '@reduxjs/toolkit'
import {
  fetchGetPostsList,
  fetchGetPosts,
  fetchGetPostId,
  fetchGetUserPosts,
  fetchCreateNewPost,
  fetchEditPost,
  fetchDeletePost,
} from '../../WebAPI'

export const postReducer = createSlice({
  name: 'posts',
  initialState: {
    isLoading: false,
    postList: [],
    postPage: [],
    post: null,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setPostList: (state, action) => {
      state.postList = action.payload
    },

    setPostPage: (state, action) => {
      state.postPage = action.payload
    },

    setPost: (state, action) => {
      state.post = action.payload
    },
  },
})

export const { setIsLoading, setPostList, setPostPage, setPost } =
  postReducer.actions

export const getPostList = () => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchGetPostsList()
    dispatch(setPostList(response))
    dispatch(setIsLoading(false))
  } catch (err) {
    console.log(err)
  }
}

export const getPostPage = (page) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchGetPosts(page)
    dispatch(setPostPage(response.data))
    dispatch(setIsLoading(false))
    return response
  } catch (err) {
    console.log(err)
  }
}

export const getPost = (id) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchGetPostId(id)
    dispatch(setPost(response))
    dispatch(setIsLoading(false))
    console.log(response.userId)
    return response
  } catch (err) {
    console.log(err)
  }
}

export const getUserPosts = (userId) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchGetUserPosts(userId)
    dispatch(
      setPostList(
        response.posts.sort((a, b) => {
          return a.createdAt < b.createdAt ? 1 : -1
        })
      )
    )
    dispatch(setIsLoading(false))
  } catch (err) {
    console.log(err)
  }
}

export const getNewPost = (history, title, body) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchCreateNewPost(title, body)
    dispatch(setIsLoading(false))
    history.push(`/posts/${response.id}`)
  } catch (err) {
    console.log(err)
  }
}

export const getEditPost = (history, id, title, body) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchEditPost(id, title, body)
    dispatch(setIsLoading(false))
    history.push(`/posts/${response.id}`)
  } catch (err) {
    console.log(err)
  }
}

export const deletePost = (id) => async (dispatch) => {
  dispatch(setIsLoading(true))
  try {
    const response = await fetchDeletePost(id)
    dispatch(setIsLoading(false))
    return response
  } catch (err) {
    console.log(err)
  }
}

export const selectIsLoading = (store) => store.posts.isLoading
export const selectPostList = (store) => store.posts.postList
export const selectPostPage = (store) => store.posts.postPage
export const selectPost = (store) => store.posts.post

export default postReducer.reducer
