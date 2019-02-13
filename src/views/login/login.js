import React, {Component} from 'react'
import './login.less'
import { Toast } from 'antd-mobile';
import Cookies from 'js-cookie'
class Login extends Component{
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: ''
    }
  }
  componentDidMount(){
    let height = document.documentElement.clientHeight || document.body.clientHeight;
    this.refs.login.style.height = height + "px";
  }
  changeUserName = event => {
    this.setState({
      userName: event.target.value
    })
  }
  changePassword = event => {
    this.setState({
      password: event.target.value
    })
  }
  login = async () => {
    let userName = this.state.userName;
    let password = this.state.password;
    if(!userName || !password){
      Toast.info("用户名或密码不能为空",2)
    }else {
      let res = await window.axios.put("/user/login",{
        name: userName,
        password: password
      })
      if(res.code === 1){
        Cookies.set("userId",res.id,{expires: 1/24});
        Cookies.set("userName",res.name,{expires: 1/24});
        this.props.history.push('/index')
      }else {
        Toast.info(res.msg,2);
      }
    }
  }
  render() {
    const {userName,password} = this.state;
    return(
      <div className="login" ref='login'>
        <div className="head">淘宝账户登录</div>
        <div className="userInfo">
          <div className="userName">
            <span>账户</span>
            <input type="text" placeholder="手机号/用户名" value={userName} onChange={this.changeUserName} />
          </div>
          <div className="password">
            <span>登录密码</span>
            <input type="password" placeholder="请输入密码" value={password} onChange={this.changePassword} />
          </div>
        </div>
        <div className="loginButton" onClick={this.login}>登录</div>
        <div className="btnGroup">
          <span>免费注册</span>
          <span>忘记密码</span>
        </div>
      </div>
    )
  }
}

export default Login;