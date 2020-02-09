import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import { reqGetProductList, reqSearchProduct,reqUpdateProductStatus } from '$api'
 
export default class Product extends Component {
  state = {
    productList: [],
    total: 0,
    isLoading: false,
    searchType:'productName',
    searchValue: '',
    current:1
  }
  //给组件定义一个属性，判断是普通获取还是搜索获取
  //因为setState是异步的，不能使用
  currentSearchValue = ''
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
      dataIndex: 'price',
      render: price => {//需要显示除数据外的其他东西，用render方法
        return `￥${price}`
      }
    },
    {
      title: '商品状态',
      //dataIndex: 'status',
      render: ({_id,status }) => {
        if (status === 1) {
          return (
            <div>
              <Button
                type='primary'
                onClick={this.updateProductStatus(_id, status)}
              >
                上架
              </Button>
              <span>已下架</span>
            </div>
          );
        }

        return (
          <div>
            <Button
              type='primary'
              onClick={this.updateProductStatus(_id, status)}
            >
              下架
            </Button>
            <span>已上架</span>
          </div>
        );
      }
    },
    {
      title: '操作',
      //dataIndex: 'xxx',
      render: (product) => {
        return (
          <div>
            <Button type="link">详情</Button>
            <Button type="link" onClick={this.showUpdateProduct(product)}>修改</Button>
          </div>
        )
      }
    }
  ]
  updateProductStatus = (productId,status) => {
    return () => {
      reqUpdateProductStatus(productId, 3 - status)
        .then(() => {
          //修改页面信息
          this.setState({
            productList:this.state.productList.map(product => {
              if (product._id === productId) {
                return {
                  ...product,
                  status: 3 - status
                }
              }
              return product;
            })
          })
          message.success('更新商品状态成功')
        })
        .catch(err => {
          message.error(err)
        })
    }
  }
  showUpdateProduct = product => {
    return () => {
      const id = product._id;
      this.props.history.push('/product/update/'+id,product)
    }
  }
  getProductList = (pageNum, pageSize) => {
    //请求之前，loading图设置为true
    this.setState({
      isLoading: true
    })
    const { currentSearchValue } = this;
    const { searchType } = this.state;
    let promise = null;
    if (currentSearchValue) {
      promise = reqSearchProduct({ searchType, searchValue:currentSearchValue,pageNum,pageSize})
    } else {
      promise= reqGetProductList(pageNum, pageSize)
    }

    promise
      .then((response) => {
        this.setState({
          productList: response.list,
          total: response.total,
          //如果修改了searchValue，没有点击搜索，还按照currentSearchValue进行搜索
          //需要将值修改回来
          searchValue: currentSearchValue,
          current:pageNum
        })
        message.success(
          `${currentSearchValue ? '搜索' : '获取'}商品列表数据成功~`
        );
      })
      .catch((err) => {
        message.error(err)
      })
      .finally(() => {
        this.setState({
          isLoading:false
        })
      })
  }
  showAddProduct = () => {
    this.props.history.push('/product/add')
  }
  componentDidMount() {
    this.getProductList(1,3)
  }
  handleSelect = value => {
    this.setState({
      searchType:value
    })
  }
  handleInput = e => {
    this.setState({
      searchValue:e.target.value.trim()
    })
  }
  search = () => {
    const { searchValue } = this.state
    this.currentSearchValue = searchValue;
    this.getProductList(1,3)
  }
  render() {
    const { productList ,total,isLoading,searchType,searchValue,current} = this.state;
    return (
      <div>
        <Card
          title={
            <div>
              <Select defaultValue={searchType} onChange={this.handleSelect}>
                <Select.Option value='productName'>根据商品名称</Select.Option>
                <Select.Option value='productSize'>根据商品描述</Select.Option>
              </Select>
              <Input placeholder="关键字"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.handleInput}
                value={searchValue}
              ></Input>
              <Button type="primary" onClick={this.search}>搜索</Button>
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
              showSizeChanger: true,
              showQuickJumper: true,
              total,
              onChange: this.getProductList,//改变页码触发
              onShowSizeChange: this.getProductList,//改变 pageSize 触发
              current
            }}
            rowKey='_id'
            loading={isLoading}
          />
        </Card>
      </div>
    )
  }
}
