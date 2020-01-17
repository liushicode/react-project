
import { reqLogin,reqGetCategoryList,reqAddCategory ,reqUpdateCategory,reqDeleteCategory} from '../api'
import { setItem } from '../utils/storage'
import {
  SAVE_USER,
  REMOVE_USER,
  CHANGE_LANGUAGE,
  GET_CATEGORY_LIST,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} from './action-types'


export const removeUser = () => ({ type: REMOVE_USER })

export const changeLanguage = lang =>({type:CHANGE_LANGUAGE,data:lang})

const saveUser = (user) => ({
  type: SAVE_USER,
  data: user
})
export const saveUserAsync = (username, password) => {
  return (dispatch) => { 
    return  reqLogin(username, password)
      .then(response => {
        //要把用户数据和token存储在redux和localStorage中
        setItem('user', response)

        dispatch(saveUser(response))
      })
    //返回值作为组件调用时的返回值
  }
}

const getCategoryList = categories => ({
  type: GET_CATEGORY_LIST,
  data:categories
})
export const getCategoryListAsync = () => {
  return (dispatch) => {
    //发送请求
    return reqGetCategoryList()
      .then((response) => {
        dispatch(getCategoryList(response))
      })
  }
}

const addCategory = category => ({
  type: ADD_CATEGORY,
  data: category
})
export const addCategoryAsync = (categoryName) => {
  return (dispatch) => {
    //发送请求
    return reqAddCategory(categoryName)
      .then((response) => {
        dispatch(addCategory(response))
      })
  }
}

const updateCategory = category => ({
  type: UPDATE_CATEGORY,
  data: category
})
export const updateCategoryAsync = (categoryId,categoryName) => {
  return (dispatch) => {
    //发送请求
    return reqUpdateCategory(categoryId,categoryName)
      .then((response) => {
        dispatch(updateCategory(response))
      })
  }
}

const deleteCategory = id => ({
  type: DELETE_CATEGORY,
  data: id
})
export const deleteCategoryAsync = (categoryId) => {
  return (dispatch) => {
    //发送请求
    return reqDeleteCategory(categoryId)
      .then((response) => {
        dispatch(deleteCategory(response))
      })
  }
}