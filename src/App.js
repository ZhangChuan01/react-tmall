import React, {Component} from 'react';
import './App.css';
import { Router,Route, Switch} from 'react-router-dom'
import Home from './views/home/Home.js'
import goodsDetail from './views/goodsDetail/GoodsDetail.js'
import login from './views/login/login'
import test from './views/test/Test'
import history from './history'

class App extends Component {
  render() {
    return (
        <div className="App">
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/index" component={Home} />
              <Route path='/goodsDetail/:gid' component={goodsDetail} />
              <Route path='/login' component={login} />
              <Route path='/test' component={test} />
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
