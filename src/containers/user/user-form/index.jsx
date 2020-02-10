import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const { Item } = Form;
const { Option } = Select;
@Form.create()
class UserForm extends Component {
  static propTypes = {
    roles: PropTypes.array.isRequired
  };
  render() {
    const validator = (rule, value, callback) => {
      const name = rule.field === "username" ? "用户名" : "密码";
      const reg = /^\w+$/;
      if (!value) {
        callback();
      } else if (value.length < 4) {
        callback(`${name}必须大于4位`);
      } else if (value.length > 15) {
        callback(`${name}必须小于15位`);
      } else if (!reg.test(value)) {
        callback(`${name}只能包含英文、数字、下划线`);
      }
      callback();
    };
    const {
      form: { getFieldDecorator },
      roles
    } = this.props;
    return (
      <Form>
        <Item label="用户名">
          {getFieldDecorator("username", {
            rules: [
              { required: true, message: "请输入用户名" },
              {
                validator
              }
            ]
          })(<Input placeholder="请输入用户名"></Input>)}
        </Item>
        <Item label="密码">
          {getFieldDecorator("password", {
            rules: [
              { required: true, message: "请输入密码" },
              {
                validator
              }
            ]
          })(<Input placeholder="请输入密码" />)}
        </Item>
        <Item label="手机号">
          {getFieldDecorator("phone", {
            rules: [{ required: true, message: "请输入手机号" }]
          })(<Input placeholder="请输入手机号" />)}
        </Item>
        <Item label="邮箱">
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "请输入邮箱" }]
          })(<Input placeholder="请输入邮箱" />)}
        </Item>
        <Item label="所属角色">
          {getFieldDecorator("roleId", {
            rules: [{ required: true, message: "请选择角色" }]
          })(
            <Select placeholder="请选择角色">
              {roles.map(role => {
                return (
                  <Option key={role._id} value={role._id}>
                    {role.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </Item>
      </Form>
    );
  }
}
export default UserForm;
