import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import { reqGetProductList } from '$api'
 
export default class Product extends Component {
  state = {
    productList: [],
    total:0
  }
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name'
    },
    {
      title: '商品描述',
      dataIndex: 'desc'
    },
    {
      title: '商品价格',
      dataIndex: 'price'
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      render: () => {
        return (
          <div>
            <Button type='primary'>上架</Button>
            <span>已下架</span>
          </div>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'xxx',
      render: () => {
        return (
          <div>
            <Button type="link">详情</Button>
            <Button type="link">修改</Button>
          </div>
        )
      }
    }
  ]
  getProductList = (pageNum,pageSize) => {
    return reqGetProductList(pageNum,pageSize)
      .then((response) => {
        this.setState({
          productList: response.list,
          total:response.total
        })
        message.success('请求商品列表成功')
      })
      .catch((err) => {
      message.error(err)
    })
  }
  showAddProduct = () => {
    this.props.history.push('/product/add')
  }
  componentDidMount() {
    this.getProductList(1,3)
  }
  render() {
    const { productList ,total} = this.state;
    return (
      <div>
        <Card
          title={
            <div>
              <Select defaultValue="1">
                <Select.Option value="1">根据商品名称</Select.Option>
                <Select.Option value="2">根据商品描述</Select.Option>
              </Select>
              <Input placeholder="关键字" style={{ width: 200, margin: '0 10px' }}></Input>
              <Button type="primary">搜索</Button>
            </div>
          }
          extra={
            <Button type="primary" onClick={this.showAddProduct}>
              <Icon type="plus" />
              添加商品
            </Button>
          }
        >
          <Table
            columns={this.columns}
            dataSource={productList}
            bordere
            pagination={{
              pageSizeOptions: ['3', '6', '9', '12'],
              defaultPageSize: 3,
              showSizeChanger:true,
              showQuickJumper: true,
              total,
              onChange: this.getProductList,//改变页码触发
              onShowSizeChange:this.getProductList//改变 pageSize 触发
            }}
            rowKey='_id'
          />
        </Card>
      </div>
    )
  }
}
