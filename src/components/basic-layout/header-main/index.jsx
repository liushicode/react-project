import React, { Component } from 'react'
import { Button, Icon, Modal } from "antd";
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";

import { removeItem } from '$utils/storage'
import { removeUser,changeLanguage } from '$redux/actions' 
import screenfull from 'screenfull'

import { injectIntl, FormattedMessage } from 'react-intl'
import menus from '$conf/menus'

import "./index.less";

@injectIntl
@connect(
  state => ({
    username: state.user.user && state.user.user.username,
    language:state.language
  }),
  {
    removeUser,
    changeLanguage
  })
@withRouter
class HeaderMain extends Component {
  state = {
    isScreenFull: false
  }
  handleChangeState = () => {
    const { isScreenFull } = this.state
    this.setState({
      isScreenFull:!isScreenFull
    })
  }
  componentDidMount() {
    screenfull.on("change", this.handleChangeState);
  }
  componentWillUnmount() {
    screenfull.off("change", this.handleChangeState);
  }
  screenFull = () => {
    screenfull.toggle()
  }
  signout = () => {
    const { intl } = this.props;
    Modal.confirm({
      title: intl.formatMessage({ id: "logout" }),
      onOk: () => {
        //清除用户数据
        removeItem("user");
        this.props.removeUser();
        //跳转页面
        this.props.history.replace("/login");
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  }
  changeLanguage = () => {
    const language = this.props.language === 'en' ? 'zh-CN' : 'en'
    this.props.changeLanguage(language)
  }
  findTitle = (menus,pathname) => {
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index];
      if (menu.children) {
        for (let index = 0; index < menu.children.length; index++) {
          const cMenu = menu.children[index];
          if (cMenu.path === pathname) {
            return cMenu.title
          }
        }
      } else {
        if (menu.path === pathname) {
          return menu.title
        }
      }
    }
  }
  render() {
    const { isScreenFull } = this.state;
    const { username,
      language,
      location:{pathname}
    } = this.props;
    //console.log(this.props);
    const title = this.findTitle(menus,pathname)
    
    return (
      <div className="header-main">
        <div className="header-top">
          <Button size="small" onClick={this.screenFull}>
            <Icon type={isScreenFull ? "fullscreen-exit" : "fullscreen"} />
          </Button>
          <Button
            className="lang-btn"
            size="small"
            onClick={this.changeLanguage}
          >
            {language === "en" ? "中文" : "English"}
          </Button>
          <span>hello,{username}</span>
          <Button type="link" size="small" onClick={this.signout}>
            退出
          </Button>
        </div>
        <div className="header-bottom">
          <span className="header-bottom-left">
            <FormattedMessage id={title}/>
          </span>
          <span className="header-bottom-right">2020/01/14 22:24:01</span>
        </div>
      </div>
    );
  }
}
export default HeaderMain
