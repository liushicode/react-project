import React, { Component } from 'react'
import { Card, Button, Radio, Table,  message ,Modal} from 'antd'
import dayjs from 'dayjs'
import { connect } from 'react-redux'

import { getRoleListAsync,addRoleAsync } from '$redux/actions'
import AddRoleForm from './add-role-form';
const { Group } = Radio;

@connect((state) => ({ roles: state.roles }),
{getRoleListAsync,addRoleAsync}
)
class Role extends Component {
  state = {
    isShowAddRoleModal:false,
    isLoading:false
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
  switchAddRoleModal = (isShowAddRoleModal) => {
    return () => {
      if (!isShowAddRoleModal) {
        this.addRoleForm.props.form.resetFields()
      }
      this.setState({
        isShowAddRoleModal: isShowAddRoleModal
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
  render() {
    const { roles } = this.props;
    const { isLoading } = this.state;
    return (
      <Card title={
        <div>
          <Button type='primary' onClick={this.switchAddRoleModal(true)}>创建角色</Button>
          <Button type='primary' disabled>设置角色权限</Button>
        </div>
      }>
        <Group style={{ width: '100%' }}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            loading = {isLoading}
          />
        </Group >
        <Modal
          title="创建新角色"
          visible={this.state.isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.switchAddRoleModal(false)}
        >
          <AddRoleForm wrappedComponentRef={form=>this.addRoleForm = form} />
          </Modal>
      </Card>
    )
  }
}
export default Role
