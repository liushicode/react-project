import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import React, { Component } from 'react'
import withCheckLogin from '$cont/with-check-login'
import logo from '../../assets/imgs/logo.png'
import './index.less'
import LeftNav from './left-nav'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


@withCheckLogin
class BasicLayout extends Component {
  state = {
    collapsed: false,
    isDisplsy:true
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    const {isDisplsy} = this.state
    this.setState({
      collapsed,
      isDisplsy:!isDisplsy
    });
  };

  render() {
    const { children } = this.props
    const { isDisplsy } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="main-logo">
            <img src={logo} alt="logo" />
            <h1 style={{display: isDisplsy?'block':'none' }}>硅谷后台</h1>
          </div>
          <LeftNav />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{children}</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}
export default BasicLayout