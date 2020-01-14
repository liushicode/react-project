import React from 'react'
import axios from 'axios'

import { message } from 'antd'




export default function Test() {
  //创建一个axios实例，可以修改axios默认配置
  const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 20000,
    headers: {

    }
  });
  //设置请求拦截器，在请求之前调用
  axiosInstance.interceptors.request.use(
    //设置公共的动态参数
    config => {
      //console.log(config);
      
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }

      //如果使用'application/x-www-form-urlencoded'发送请求,将json对象转化为字符串
      if (config.method === 'post') {
        const keys = Object.keys(config.data)
        const data = keys.reduce((prev, curr) => {
          prev += `&${curr}=${config.data[curr]}`
          return prev
        }, '').slice(1)
        config.data = data;
        config.headers['contenttype'] = 'application/x-www-form-unlencoded'
      }
      return config;
    }
    //代码失败，返回一个失败的promise
    /* err => {
      return Promise.reject(err);
    } */
  )
  //设置请求拦截器，在响应之后调用，在axiosInstance的.then()/.catch()方法之前
  axiosInstance.interceptors.response.use(
    //响应成功，保证下一个.then接收到的一定是成功
    response => {
      if (response.data.status === 0) {
        return response
      } else {
        return Promise.reject(response.data.msg)
      }
    },
    //响应失败
    err => {
      const errCode = {
        401: '没有权限访问当前接口',
        403: '禁止访问当前接口',
        404: '找不到当前接口',
        500:'服务器出现问题'
      }
      let errMessage = ''
      //接收到失败的响应
      if (err.response) {
        errMessage = errCode[err.response.status]
      } else {
        //没有接收到响应
        if (err.message.indexOf('Network Error') !== -1) {
          errMessage = '网络连接错误，请重连网络'
        } else if (err.message.indexOf('timeout') !== -1) {
          errMessage = '网络延迟，请换个网络'
        }
      }
      return Promise.reject(errMessage || '未知错误')
    }
  )

  let token = ''
  let id = ''
  const handleClick1 = () => {
    axiosInstance({
      method:'POST',
      url:'/login',
      data: {
        username:'admin',
        password:'admin'
      }
    })
    .then(response => {
      //console.log(response);
      token = response.token;
      message.success('登录成功');
      /* if (response.data.status === 0) {
        token = response.data.data.token;
        message.success('登录成功');
      } else {
        message.error(response.data.msg);
      } */
      })
    .catch((err) => {
      console.log(err);
      message.error(err)
    })
  }
  const handleClick2 = () => {
    axiosInstance({
      method: 'POST',
      url: '/category/add',
      data: {
        categoryName:"课程"
      },
      /* headers: {
        authorization:`bearer ${token}`
      } */
    })
      .then((response) => {
        //console.log(response.data);
        id = response._id
        message.success('添加分类成功')
        /* if (response.data.status === 0) {
          id = response.data.data._id
          message.success('添加分类成功')
        } else {
          message.error(message.data.msg)
        } */
      })
      .catch((err) => {
        console.log(err);
        message.error(err)
      })
  }
  const handleClick3 = () => {
    axiosInstance({
      method: 'POST',
      url: '/category/delete',
      data: {
        categoryId:id
      },
      /* headers: {
        authorization: `bearer ${token}`
      } */
    })
      .then((response) => {
        //console.log(response.data);
        message.success('删除分类成功')
        /* if (response.data.status === 0) {
          message.success('删除分类成功')
        } else {
          message.error(message.data.msg)
        } */
      })
      .catch((err) => {
        console.log(err);
        message.error('网络错误')
      })
  }
  return (
    <div>
      <button onClick={handleClick1}>按钮1</button>
      <button onClick={handleClick2}>按钮2</button>
      <button onClick={handleClick3}>按钮3</button>
    </div>
  )
}
