/**
 * 高级组件，检测是否已经登录
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

export default function withCheckLogin(WrappedComponent) {
  @connect(state => ({ user: state.user }),null)
  class CheckLogin extends Component{
    static displayName = `checkLogin(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;
    render() {
      const {
        user: { token },
        location: { pathname }
      } = this.props;
      if (token) {
        //说明已经登录过
        if (pathname === '/login') {
          return <Redirect to='/'/>
        }
      } else {
        //说明没有登录过
        if (pathname === '/'){
          return <Redirect to='/login'/>
        }
      }
      return <WrappedComponent {...this.props} />
    }
  }
  return CheckLogin
}

