import React, { Component } from 'react'
import { Button, Icon, Modal } from "antd";
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";

import { removeItem } from '$utils/storage'
import { removeUser,changeLanguage } from '$redux/actions' 
import screenfull from 'screenfull'

import { injectIntl, FormattedMessage } from 'react-intl'
import menus from '$conf/menus'
import dayjs from 'dayjs'//时间格式化插件

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
    isScreenFull: false,
    date: Date.now()
  }
  handleChangeState = () => {
    const { isScreenFull } = this.state
    this.setState({
      isScreenFull:!isScreenFull
    })
  }
  componentDidMount() {
    screenfull.on("change", this.handleChangeState);
    this.timeId = setInterval(() => {
      this.setState({
        date:Date.now()
      })
    },1000)
  }
  componentWillUnmount() {
    screenfull.off("change", this.handleChangeState);
    clearInterval(this.timeId)
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
          // if (cMenu.path === pathname) {
          //   return cMenu.title
          // }
          //加入addProduct后title找不到,地址栏路径包含/product和product/add
          if (pathname.indexOf(cMenu.path) !== -1) {
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
    const { isScreenFull,date } = this.state;
    const {
      username,
      language,
      location:{pathname}
    } = this.props;
    const title = this.findTitle(menus,pathname)
    //加入addProduct后title找不到
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
            <FormattedMessage id={title} />
          </span>
          <span className="header-bottom-right">
            {dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>
      </div>
    );
  }
}
export default HeaderMain
