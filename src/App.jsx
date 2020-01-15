import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl'

import Home from './components/home';
import Login from './containers/login';
import BasicLayout from '$comp/basic-layout'
import { en, zhCN } from './locales';
import { ConfigProvider } from "antd";//设置antd组件的国际化

import zh_CN from "antd/es/locale/zh_CN";
import en_US from "antd/es/locale/en_US";

import { connect } from 'react-redux'

@connect(state => ({ language: state.language }), null)
class App extends Component {
  render() {
    const language = this.props.language;
    const message = language === "en" ? en : zhCN;
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
                <Route path="/" exact component={Home} />
              </BasicLayout>
            </Switch>
          </Router>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}
export default App
