
import {
  reqLogin,
  reqGetCategoryList,
  reqAddCategory,
  reqUpdateCategory,
  reqDeleteCategory,
  reqGetRoleList,
  reqAddRole
} from '../api'

import { setItem } from '../utils/storage'
import {
  SAVE_USER,
  REMOVE_USER,
  CHANGE_LANGUAGE,
  GET_CATEGORY_LIST,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ROLE_LIST,
  ADD_ROLE
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
        //把用户数据存储在localStorage
        setItem('user', response)
        dispatch(saveUser(response))
      })
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

const getRoleList = roles => ({
  type: GET_ROLE_LIST,
  data:roles
})
export const getRoleListAsync = () => {
  return (dispatch) => {
    //发送请求
    return reqGetRoleList()
      .then((response) => {
        dispatch(getRoleList(response))
      })
  }
}

const addRole = role => ({ type: ADD_ROLE, data: role })
//异步action
export const addRoleAsync = (name) => {
  return (dispatch) => {
    return reqAddRole(name)
      .then((res) => {
        dispatch(addRole(res))
      })
  }
}