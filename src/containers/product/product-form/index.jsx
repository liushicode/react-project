import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button, InputNumber,message } from 'antd'
import BraftEditor from "braft-editor";
import { connect } from 'react-redux'

import './index.less'
import "braft-editor/dist/index.css";
import { getCategoryListAsync } from "$redux/actions";
import { reqAddProduct,reqUpdateProduct } from '$api'

const { Item } = Form;
const { Option } = Select

@connect(state => ({ categories: state.categories }), {getCategoryListAsync})
@Form.create()
class ProductForm extends Component {
  goBack = () => {
    this.props.history.push("/product");
  };
  componentDidMount() {
    if (!this.props.categories.length) {
      //避免多次发送请求
      // 如果redux管理的categories有数据，再发送请求，请求分类数据
      this.props.getCategoryListAsync();
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
  handleCategoryId = isAddProduct => {
    //如果是添加商品，什么都不显示
    if (isAddProduct) {
      return '0'
    }
    //修改商品
    const { categories, location: {
      state: { categoryId }
    } } = this.props;
    const category = categories.find((category) => {
      return category._id === categoryId;
    })
    if (category) {
      return categoryId
    }
    return '0'
  }
  render() {
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
    const {
      form: { getFieldDecorator },
      categories
    } = this.props;
    const { state } = this.props.location;
    let isAddProduct = this.isAddProduct();
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
              initialValue: this.handleCategoryId(isAddProduct)
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
