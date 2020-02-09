import React, { Component } from 'react'
import { Card, Button, Table, message, Modal} from 'antd'
import dayjs from 'dayjs'
import { connect } from 'react-redux'

import {reqGetUser,reqAddUser} from '$api'
import { getRoleListAsync } from '$redux/actions'
import UserForm from './user-form'

@connect(state => ({ roles: state.roles }), { getRoleListAsync})
class User extends Component {
  state = {
    isLoading: false,
    users: [],
    isShowUserModal:false
  }
  columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '手机号',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: time => dayjs(time).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      title: '所属角色',
      dataIndex: 'roleId',
      render: roleId => {
        const role = this.props.roles.find(role => role._id === roleId);
        return role && role.name;
      }
    },
    {
      title: '操作',
      // dataIndex: 'roleId',
      render: () => {
        return (
          <div>
            <Button type='link'>修改</Button>
            <Button type='link'>删除</Button>
          </div>
        );
      }
    }
  ]
  componentDidMount() {
    this.setState({
      isLoading:true
    })
    reqGetUser()
      .then((res) => {
        this.setState({
          users: res
        })
        message.success('获取用户列表数据成功');
      })
      .catch(err => {
        message.error(err)
      })
      .finally(() => {
        this.setState({
          isLoading:false
        })
      })
    //为了获取用户所属角色
    if (!this.props.roles.length) {
      this.props
        .getRoleListAsync()
        .then(() => {
          message.success('获取角色列表数据成功');
        })
        .catch(err => {
          message.error(err);
        });
    }
  }
  switchModal = (isShowUserModal) => {
    return () => {
      this.setState({
        isShowUserModal:isShowUserModal
      })
    }
  }
  addUser = () => {
    const { validateFields, resetFields } = this.userform.props.form;
    validateFields((err,values) => {
      if (!err) {
        const { username, password, phone, email, roleId } = values
        reqAddUser({ username, password, phone, email, roleId })
          .then((res) => {
            message.success('添加用户成功');
            this.setState({
              users: [...this.state.users, res],
              isShowUserModal:false
            })
            resetFields()
          })
          .catch(err => {
            message.error(err)
          })
      }
    })
  }
  render() {
    const { isLoading, users,isShowUserModal } = this.state;
    const { roles } = this.props;
    return (
      <Card title={
        <div>
          <Button type="primary" onClick={this.switchModal(true)}>添加用户</Button>
        </div>
      }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          loading={isLoading}
        >
        </Table>
        <Modal
          title='创建用户'
          visible={isShowUserModal}
          onOk={this.addUser}
          onCancel={this.switchModal(false)}
        >
          <UserForm roles={roles} wrappedComponentRef={form=>(this.userform=form)} />
          </Modal>
      </Card>
    )
  }
}
export default User
