import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal,message } from 'antd'
import { connect } from 'react-redux'
import { getCategoryListAsync, addCategoryAsync, updateCategoryAsync,deleteCategoryAsync } from "$redux/actions";
import AddCategoryForm from './add-categoty-form'

@connect(state => ({ categories: state.categories }), {
  getCategoryListAsync,
  addCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync
})
class Category extends Component {
  state = {
    isShowCategoryModal: false,
    category: {}
  }
  componentDidMount() {
    //调用，获取数据列表
    if (!this.props.categories.length) {
      this.props.getCategoryListAsync();
    }
  }
  columns = [
      {
        title: "品类名称",
        dataIndex: "name",
      },
      {
        title: "操作",
        //dataIndex: "operation",
        render: (category) => {
          return (
            <div>
              <Button type="link" onClick={this.showCategoryModal(category)}>修改分类</Button>
              <Button type="link" onClick={this.delCategory(category)}>删除分类</Button>
            </div>
          );
        }
      }
  ];
  //添加/修改分类
  setCategory = () => {
    const { validateFields, resetFields } = this.addCategoryForm.props.form
    const { category: {name,_id } } = this.state
    validateFields((err, values) => {
      if (!err) {
        const { categoryName } = values
        console.log(values);
        let promise = null;
        if (name) {
          promise = this.props.updateCategoryAsync(_id,categoryName)
        } else {
          promise = this.props.addCategoryAsync(categoryName)
        }
        promise
          .then(() => {
            message.success(`${name ? '修改':'添加'}分类成功`)
            resetFields()//清空表单数据
            this.hiddenCategory()//隐藏添加输入框
          })
          .catch((err) => {
          message.error(err)
        })
        
      }
    });
  }
  //删除分类
  delCategory = (category) => {
    return () => {
      Modal.confirm({
        title: `你确认要删除${category.name}吗`,
        onOk: () => {
          this.props.deleteCategoryAsync(category._id)
            .then(() => {
              message.success('删除分类成功')
            })
            .catch((error) => {
              message.error(error)
            })
        }
      })
    }
  }
  //隐藏modal框
  hiddenCategory = () => {
    this.addCategoryForm.props.form.resetFields();
    this.setState({
      isShowCategoryModal:false
    })
  }
  //显示modal框，设置category数据
  showCategoryModal = (category = {}) => {
    return () => {
      this.setState({
        isShowCategoryModal: true,
        category
      })
    }
  }
  render() {
    const columns = this.columns
    const data = this.props.categories;
    
    const { isShowCategoryModal,category } = this.state;
    return (
      <div>
        <Card
          title="分类列表"
          extra={
            <Button type="primary" onClick={this.showCategoryModal()}>
              <Icon type="plus" />
              分类列表
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultPageSize: 3,
              pageSizeOptions: ["3", "6", "9", "12"] //指定每页可以显示多少条
            }}
            rowKey='_id'
          />
          <Modal
            title={category.name ? "修改分类" : "添加分类"}
            visible={isShowCategoryModal}
            onOk={this.setCategory}
            onCancel={this.hiddenCategory}
            width={400}
          >
            <AddCategoryForm
              categoryName={category.name}
              wrappedComponentRef={(form) => this.addCategoryForm = form}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}
export default Category
