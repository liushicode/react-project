import React, { Component } from 'react'
import { Card, Button, Radio, Table,  message ,Modal} from 'antd'
import dayjs from 'dayjs'
import { connect } from 'react-redux'

import { getRoleListAsync } from '$redux/actions'
const { Group } = Radio;

@connect((state) => ({ roles: state.roles }),
{getRoleListAsync}
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
      this.setState({
        isShowAddRoleModal: isShowAddRoleModal
      })
    }
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
          onOk={this.handleOk}
          onCancel={this.switchAddRoleModal(false)}
        />
      </Card>
    )
  }
}
export default Role
