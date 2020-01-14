/**
 * 封装axios
 */

import axios from 'axios'
import errCode from '../config/err-code'
import store from '$redux/store'

//axios实例
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: {
    
  }
})

//请求拦截器，在发送请求之前执行
axiosInstance.interceptors.request.use(
  config => {
    const token = store.getState().user.token;
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    if (config.method === 'post') {
      const keys = Object.keys(config.data);
      const data = keys.reduce((prev, curr) => {
        prev += `&${curr}=${config.data[curr]}`
        return prev
      }, '').slice(1)
      config.data = data;
      config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    return config;
  }
)

//响应拦截器，在接受到响应之后执行
axiosInstance.interceptors.response.use(
  response => {
    if (response.data.status === 0) {
      return response.data.data;
    } else {
      return Promise.reject(response.data.msg);
    }
  },
  err => {
    let errMessage = ''
    //接收到失败的响应
    if (err.response) {
      errMessage = errCode[err.response.status]
    } else {
      //没有接收到响应
      if (err.message.indexOf('Network Error') !== -1) {
        errMessage = '网络连接错误，请重连网络'
      } else if (err.message.indexOf('timeout') !== -1) {
        errMessage = '网络延迟，请换个快速网络'
      }
    }
    return Promise.reject(errMessage || '未知错误')
  }
)

export default axiosInstance

