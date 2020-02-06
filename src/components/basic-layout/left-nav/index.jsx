import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { FormattedMessage } from "react-intl";

import { Link, withRouter } from 'react-router-dom'
//withRouter 给子组件提供路由组件三大属性

import menus from '$conf/menus'
const { SubMenu, Item } = Menu;

@withRouter
class LeftNav extends Component {
  createMenus = menus => {
    return menus.map((menu) => {
      if (menu.children) {
        //说明是二级菜单,menu.children也是一个数组
        return (
          <SubMenu
            key={menu.path}
            title={
              <span>
                <Icon type={menu.icon} />
                <span><FormattedMessage id={menu.title} /></span>
              </span>
            }
          >
            {menu.children.map(cMenu => this.createMenuItem(cMenu))}
          </SubMenu>
        );
      } else {
        //一级菜单
        return this.createMenuItem(menu)
      }
    })
  }
  //生成导航元素
  createMenuItem = menu => {
    return (
      <Item key={menu.path}>
        <Link to={menu.path}>
          <Icon type={menu.icon} />
          <span><FormattedMessage id={menu.title} /></span>
        </Link>
      </Item>
    )
  }
  findkeys = (pathname, menus) => {
    const menu = menus.find((menu) => {
      /* if (menu.children) {
        return menu.children.find(cMenu => cMenu.path === pathname)
      } */
      return (
        menu.children && menu.children.find(cMenu => cMenu.path === pathname)
      );
    })
    if (menu) {
      return menu.path;
    }
  }

  render() {
    let { pathname } = this.props.location
    if (pathname.indexOf('/product') !== -1) {
      pathname = '/product'
    }
    const openKeys = this.findkeys(pathname,menus)
    return (
      <Menu
        theme="dark"
        defaultSelectedKeys={[pathname]}
        //设置默认展开的导航元素
        defaultOpenKeys={[openKeys]}
        mode="inline"
      >
        {this.createMenus(menus)}
      </Menu>
    )
  }
}
export default LeftNav


