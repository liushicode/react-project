import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button, InputNumber,message } from 'antd'
import BraftEditor from "braft-editor";
import { connect } from 'react-redux'

import './index.less'
import "braft-editor/dist/index.css";
import { getCategoryListAsync } from "$redux/actions";
import { reqAddProduct,reqUpdateProduct,reqGetProduct } from '$api'

const { Item } = Form;
const { Option } = Select

@connect(state => ({ categories: state.categories }), {getCategoryListAsync})
@Form.create()
class ProductForm extends Component {
  state = {
    product:{}
  }
  goBack = () => {
    this.props.history.push("/product");
  };
  componentDidMount() {
    if (!this.props.categories.length) {
      //避免多次发送请求
      // 如果redux管理的categories有数据，再发送请求，请求分类数据
      this.props.getCategoryListAsync();
    }
    //判断是否是修改商品，有无state数据
    if (!this.isAddProduct() && !this.props.location.state) {
      //都没有，要手动请求数据回来
      const productId = this.props.match.params.id;
      reqGetProduct(productId)
        .then((res) => {
          this.setState({
            product:res
          })
        })
        .catch(err => {
          message.error(err)
        })
    }
  }
  isAddProduct = () => {
    return this.props.location.pathname.indexOf('/update/') === -1
  }
  submit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { name, desc, categoryId, price, detail } = values;
        let isAddProduct = this.isAddProduct();
        let promise = null;
        if (isAddProduct) {
          promise = reqAddProduct({
            name,
            desc,
            categoryId,
            price,
            detail: detail.toHTML()
          })
        } else {
          promise = reqUpdateProduct({
            name,
            desc,
            categoryId,
            price,
            detail: detail.toHTML(),
            productId: this.props.match.params.id
          })
        }
        promise
          .then(() => {
            message.success(`${isAddProduct ? '添加' :'修改'}商品成功`)
            this.props.history.push('/product')
          })
          .catch((err) => {
            message.error(err)
          })
        
      }
    });
  };
  //处理商品Id
  handleCategoryId = (isAddProduct,product) => {
    //如果是添加商品，什么都不显示
    if (isAddProduct) {
      return '0'
    }
    //修改商品
    const { categories } = this.props;
    const { categoryId } = product;
    const category = categories.find((category) => {
      // category._id 是分类数据中的id
      // categoryId 指的是路由传参的商品数据的分类id
      return category._id === categoryId;
    })
    if (category) {
      return categoryId
    }
    return '0'
  }
  render() {
    const {
      form: { getFieldDecorator },
      categories,
      location
    } = this.props;
    const { product } = this.state;
    const routeData = location.state;
    //state不能为空，如果roudateData为undefined,就从state中获取
    const state = routeData || product;
    //标识是否是添加商品
    const isAddProduct = this.isAddProduct();
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    };
    return (
      <Card
        title={
          <div>
            <Icon type="arrow-left" className="go-back" onClick={this.goBack} />
            {isAddProduct ? '添加商品':'修改商品'}
          </div>
        }
      >
        <Form {...formItemLayout} onSubmit={this.submit}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入商品名称" }],
              initialValue :isAddProduct ? '': state.name
            })(<Input placeholder="请输入商品名称"></Input>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              rules: [{ required: true, message: "请输入商品描述" }],
              initialValue: isAddProduct ? '' : state.desc
            })(<Input placeholder="请输入商品描述"></Input>)}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryId", {
              rules: [{ required: true, message: "请选择商品分类" }],
              initialValue: this.handleCategoryId(isAddProduct,product)
            })(
              <Select placeholder="请选择商品分类">
                <Option value='0' key = '0'>暂无分类</Option>
                {categories.map(category => {
                  return (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              rules: [{ required: true, message: "请输入商品价格" }],
              initialValue: isAddProduct ? '' : state.price
            })(
              <InputNumber
                className="product-price"
                formatter={value =>
                  `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/￥\s?|(,*)/g, "")}
              />
            )}
          </Item>
          <Item label="商品详情" wrapperCol={{ span: 22 }}>
            {getFieldDecorator("detail", {
              rules: [{ required: true, message: "请输入商品描述" }],
              initialValue: isAddProduct ? '' : BraftEditor.createEditorState(state.detail)
            })(<BraftEditor className="braft-editor" />)}
          </Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}
export default ProductForm
