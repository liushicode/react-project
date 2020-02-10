import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl'

import Login from './containers/login';
import BasicLayout from '$comp/basic-layout'
import { en, zhCN } from './locales';
import { ConfigProvider } from "antd";//设置antd组件的国际化
import routes from './config/routes'

import zh_CN from "antd/es/locale/zh_CN";
import en_US from "antd/es/locale/en_US";

import { connect } from 'react-redux'

@connect(state => ({ language: state.language, user: state.user.user }), null)
class App extends Component {
  render() {
    const {language,user} = this.props;
    const message = language === "en" ? en : zhCN;
    //登录过有user就有,才需要对路由进行处理，没有登录过user为undefined
    //根据用户权限，来判断那些路由要加载
    let filterRoutes = [];
    if (user) {
      const roleMenus = user.menus;
      filterRoutes = routes.filter(route => {
        return roleMenus.find(menu => {
          console.log(menu);
          console.log(route.path);
          
          return (
            route.path === menu ||//正常情况，一一对应
            (menu === '/product' && route.path.startsWith(menu))//menu为product并且path以product开头
          );
        })
      })
    }

    
    return (
      <ConfigProvider locale={language === "en" ? en_US : zh_CN}>
        <IntlProvider
          locale={language}//选择语言和语言包
          messages={message}
        >
          <Router>
            <Switch>
              <Route path="/login" exact component={Login} />
              <BasicLayout>
                {filterRoutes.map((route) => {
                  //return <Route path={route.path} exact={route.exact} component={route.component} />
                  return <Route {...route} key={route.path} />
                })}
              </BasicLayout>
            </Switch>
          </Router>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}
export default App
