
import { reqLogin } from '../api'
import { setItem } from '../utils/storage'
import {SAVE_USER,REMOVE_USER,CHANGE_LANGUAGE } from './action-types'

const saveUser = (user) => ({
  type: SAVE_USER,
  data: user
})
export const removeUser = () => ({ type: REMOVE_USER })

export const changeLanguage = lang =>({type:CHANGE_LANGUAGE,data:lang})

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