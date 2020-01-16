import React, { Component } from 'react'
import { Card, Button, Icon, Table, Divider, Tag } from 'antd'
import { connect } from 'react-redux'
import {getCategoryListAsync} from "$redux/actions";

@connect(state => ({ categories: state.categories }), {
  getCategoryListAsync
})
class Category extends Component {
  componentDidMount() {
    //调用，获取数据列表
    this.props.getCategoryListAsync();
  }
  columns = [
      {
        title: "品类名称",
        dataIndex: "name"
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
  render() {
    const columns = this.columns
    const data = this.props.categories;
    return (
      <div>
        <Card
          title="分类列表"
          extra={
            <Button type="primary">
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
        </Card>
      </div>
    );
  }
}
export default Category
