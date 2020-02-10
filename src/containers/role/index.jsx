import React, { Component } from 'react'
import { Card, Button, Radio, Table,  message ,Modal} from 'antd'
import dayjs from 'dayjs'
import { connect } from 'react-redux'

import { getRoleListAsync,addRoleAsync,updateRoleAsync } from '$redux/actions'
import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form'
const { Group } = Radio;

@connect((state) => ({ roles: state.roles,username:state.user.user.username }),
{getRoleListAsync,addRoleAsync,updateRoleAsync}
)
class Role extends Component {
  state = {
    isShowAddRoleModal: false,
    isShowUpdateRoleModal:false,
    isLoading: false,
    role:{},//选中的角色
  }
  componentDidMount() {
    this.setState({
      isLoading:true
    })
    this.props.getRoleListAsync()
      .then(() => {
        message.success('获取角色列表成功')
      })
      .catch(err => {
        message.error(err)
      })
      .finally(() => {
        this.setState({
          isLoading:false
        })
      })
  }
  columns = [
    {
      dataIndex: '_id',
      render: id => {
        return <Radio key={id} value={id} />;
      }
    },
    {
      title: '角色名',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: time => dayjs(time).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      title: '授权时间',
      dataIndex: 'authTime',
      render: time => {
        //没有授权时，不应该显示时间,time为undefined时，页面不显示，有time,显示授权时间
        return time && dayjs(time).format('YYYY/MM/DD HH:mm:ss');
      }
    },
    {
      title: '授权人',
      dataIndex: 'authName'
    }
  ]
  //控制Modal框显示/隐藏
  switchModal = (key, value) => {
    return () => {
      //如果处于隐藏状态，清空表单数据
      if (!value) {
        if (key === 'isAddRoleModal') {
          this.addRoleForm.props.form.resetFields()
        } else {
          //this.addRoleForm.props.form.resetFields()
        }
      }
      this.setState({
        [key]: value
      })
    }
  }
  //添加角色
  addRole = () => {
    //console.log(this.addRoleForm);
    //收集表单数据，发送创建角色请求
    const { validateFields,resetFields } = this.addRoleForm.props.form
    validateFields((err, values) => {
      if (!err) {
        const { name } = values;
        this.props.addRoleAsync(name)
          .then(() => {
            message.success('创建新角色成功')
            //隐藏添加角色框
            this.setState({
              isShowAddRoleModal: false,
            })
            //清除表单数据
            resetFields()
          })
          .catch(err => {
            message.error(err)
          })
      }
    })
    
  }
  //更新角色权限
  updateRole = () => {
    const { validateFields, resetFields } = this.updateRoleForm.props.form
    validateFields((err,values) => {
      if (!err) {
        const { menus } = values;
        const roleId = this.state.role._id;
        const authName = this.props.username;
        this.props.updateRoleAsync({ roleId, menus:JSON.stringify(menus), authName })
          .then((res) => {//promise数据传递
            message.success('更新角色权限成功')
            this.setState({
              isShowUpdateRoleModal: false,
              role:res
            })
            //清空表单数据
            resetFields();
          })
          .catch(err => {
            message.error(err)
          })
      }
    })
  }
  handleRadioChange = (e) => {
    //只能获取到id
    const id = e.target.value;
    const role = this.props.roles.find(role=> role._id === id)
    //更新状态
    this.setState({
      role
    })
  }
  render() {
    const { roles } = this.props;
    const { isLoading,role,isShowAddRoleModal,isShowUpdateRoleModal } = this.state;
    return (
      <Card title={
        <div>
          <Button type='primary' onClick={this.switchModal('isShowAddRoleModal',true)}>创建角色</Button>
          &nbsp;&nbsp;
          <Button type='primary' disabled={!role._id} onClick={this.switchModal('isShowUpdateRoleModal',true)}>设置角色权限</Button>
        </div>
      }>
        <Group style={{ width: '100%' }} onChange={this.handleRadioChange}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultPageSize: 6,
              pageSizeOptions: ["3", "6", "9", "12"] //指定每页可以显示多少条
            }}
            rowKey='_id'
            loading = {isLoading}
          />
        </Group >
        <Modal
          title="创建新角色"
          visible={isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.switchModal('isShowAddRoleModal',false)}
        >
          <AddRoleForm wrappedComponentRef={form=>(this.addRoleForm = form)} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.updateRole}
          onCancel={this.switchModal('isShowUpdateRoleModal',false)}
        >
          <UpdateRoleForm role={role}
            wrappedComponentRef={form=>(this.updateRoleForm = form)}
          />
        </Modal>
      </Card>
    )
  }
}
export default Role
