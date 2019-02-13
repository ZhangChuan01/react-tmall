import React, {Component} from 'react'
import { Link } from 'react-router-dom'
class Test extends Component{
  // constructor(props) {
  //   super(props)
  // }

  componentWillMount(){
    console.log(this.props)
  }
  render(){
    return(
      <div>
        <Link to="/index">this is test</Link>
        {/*<div>{this.props.text}</div>*/}
      </div>
    )
  }
}

export default Test;