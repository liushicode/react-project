import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom'
//withRouter 给子组件提供路由组件三大属性
import { FormattedMessage } from "react-intl";
import { connect } from 'react-redux';

import menus from '$conf/menus'
const { SubMenu, Item } = Menu;

@connect(state=>({roleMenus:state.user.user.menus}))
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
    // 如pathname有/product，改为/product
    if (pathname.indexOf('/product') !== -1) {
      pathname = '/product'
    }
    //获取用户拥有的权限，加载对应数据
    const roleMenus = this.props.roleMenus//权限菜单
    const filterMenus = menus.reduce((p, c) => {
      //对遍历出的菜单元素进行深度克隆，避免修改原来数据，修改原数据会导致其他用户登录出现问题
      //对深度克隆后的元素进行处理，就不会修改原来的值
      c = JSON.parse(JSON.stringify(c));
      //如果属于权限菜单，或者有子元素，子菜单中可能有权限菜单
      if ((roleMenus.indexOf(c.path) !== -1) || c.children) {
        if (c.children) {
          const children = c.children.filter(item => {
            return roleMenus.indexOf(item.path) !== -1;
          });
          //子菜单中没有属于权限菜单的，不需要添加，不再进行处理
          if (!children.length) {
            return p;
          } 
          //对拥有子菜单的父级菜单进行处理，只保留属于权限菜单的子菜单
          c.children = children;
        }
        //统一添加
        p.push(c)
      }
      return p
    },[])
    const openKeys = this.findkeys(pathname, filterMenus)
    return (
      <Menu
        theme="dark"
        defaultSelectedKeys={[pathname]}
        //设置默认展开的导航元素
        defaultOpenKeys={[openKeys]}
        mode="inline"
      >
        {this.createMenus(filterMenus)}
      </Menu>
    )
  }
}
export default LeftNav


