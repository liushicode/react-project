

import axiosInstance from './request'
export const reqLogin = (username,password) => {
  return axiosInstance({
    url: '/login',
    method:'POST',
    data: {
      username,
      password
    }
  })
}
export const reqGetCategoryList = () => {
  return axiosInstance({
    url: '/category/get',
    methos:'GET'
  })
}

export const reqAddCategory = (categoryName) => {
  return axiosInstance({
    url: '/category/add',
    method: 'POST',
    data: {
      categoryName
    }
  })
}