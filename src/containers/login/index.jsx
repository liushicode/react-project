import React, { Component } from 'react'
import logo from './logo.png'
import { Form, Icon, Input, Button,message } from "antd";
//import axios from 'axios'
import './index.less'

import { connect } from 'react-redux'
import { saveUserAsync } from '../../redux/actions'
 
@connect(
  null,
  {saveUserAsync}
 )
 @Form.create()//装饰器语法
 class Login extends Component {

  // 自定义表单校验规则
   validator = (rule, value, callback) => {
    //console.log(rule,value);//表单的key和value
    const name = rule.field === "username" ? "用户名" : "密码";

    const reg = /^\w+$/;

    if (!value) {
      callback(`${name}不能为空`);
    } else if (value.length < 4) {
      callback(`${name}必须大于4位`);
    } else if (value.length > 15) {
      callback(`${name}必须小于15位`);
    } else if (!reg.test(value)) {
      callback(`${name}只能包含英文、数字、下划线`);
    }
    callback();
   };
   //点击登录表单提交
   submitLogin = (e) => {
     e.preventDefault();
     //先进行表单校验
     this.props.form.validateFields((err, values) => {
       //console.log(err,values);//null {username: "aadf", password: "dsaf"}
       const { username, password } = values
       //说明表单校验成功
       if (!err) {
         /* //发送请求,利用代理服务器解决跨域
         axios.post("/api/login", { username, password })
         //说明请求成功
         .then((response) => {
           console.log(response.data);
           
           if (response.data.status === 0) {
             this.props.history.replace('/')
           } else {
             //显示错误信息
             message.error(response.data.msg);
             //清空密码框内容
             this.props.form.resetFields(['password'])
           }
         })
           //请求失败
          .catch(err => {
            //显示错误信息
             console.log(err);
             message.error('网络错误');
             //清空密码框内容
           this.props.form.resetFields(['password'])
         }) */

         this.props.saveUserAsync(username, password)
           .then(() => {
            this.props.history.replace('/') 
           })
           .catch((msg) => {
             message.error(msg);
             this.props.form.resetFields(['password'])
           })
       }
     });
   }

  render() {
    //先要通过Form.create()(Login)引入form属性
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-section">
          <h3>用户登录</h3>
          <Form className="login-form" onSubmit={this.submitLogin}>
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [
                  {
                    validator: this.validator
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    validator: this.validator
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                className="login-form-btn"
                type="primary"
                htmlType="submit"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
export default Login;