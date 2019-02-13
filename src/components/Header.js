import React, {Component} from 'react'
import './header.less'
// import PropTypes from 'prop-types';

class Header extends Component{
  constructor(props) {
    super(props)
  }
  toIndex = () =>{
    this.props.history.push('/index')
  }
  render(){
    return(
      <div className="header">
        <div className="back" onClick={this.toIndex}>
          <i className="iconfont icon-xiangzuo"></i>
        </div>
        <div className="cart">
          <i className="iconfont icon-gouwuche"></i>
        </div>
      </div>
    )
  }
}

export default Header;