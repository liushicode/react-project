import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal,message } from 'antd'
import { connect } from 'react-redux'
import { getCategoryListAsync, addCategoryAsync } from "$redux/actions";
import AddCategoryForm from './add-categoty-form'

@connect(state => ({ categories: state.categories }), {
  getCategoryListAsync,
  addCategoryAsync
})
class Category extends Component {
  state = {
    isShowAddCategoty:false
  }
  componentDidMount() {
    //调用，获取数据列表
    this.props.getCategoryListAsync();
  }
  columns = [
      {
        title: "品类名称",
        dataIndex: "name",
      },
      {
        title: "操作",
        dataIndex: "operation",
        render() {
          return (
            <div>
              <Button type="link">修改分类</Button>
              <Button type="link">删除分类</Button>
            </div>
          );
        }
      }
  ];
  addCategory = () => {
    const { validateFields,resetFields } = this.addCategoryForm.props.form
    validateFields((err, values) => {
      if (!err) {
        const { categoryName } = values
        console.log(values);
        this.props.addCategoryAsync(categoryName)
          .then(() => {
            message.success('添加分类成功')
            resetFields()//清空表单数据
            this.hiddenCategory()//隐藏添加输入框
          })
          .catch((err) => {
          message.error(err)
        })
        
      }
    });
  }
  hiddenCategory = () => {
    this.setState({
      isShowAddCategoty:false
    })
  }
  showAddCategory = () => {
    this.setState({
      isShowAddCategoty: true
    })
  }
  render() {
    const columns = this.columns
    const data = this.props.categories;
    
    const { isShowAddCategoty } = this.state;
    return (
      <div>
        <Card
          title="分类列表"
          extra={
            <Button type="primary" onClick={this.showAddCategory}>
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
            title="添加分类"
            visible={isShowAddCategoty}
            onOk={this.addCategory}
            onCancel={this.hiddenCategory}
            width={400}
          >
            <AddCategoryForm wrappedComponentRef={(form) => this.addCategoryForm = form}/>
          </Modal>
        </Card>
      </div>
    );
  }
}
export default Category
