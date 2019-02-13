import React from 'react';
import ReactDOM from 'react-dom';
import 'reset-css'
import 'antd-mobile/dist/antd-mobile.css'
import './theme/font.css'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios'
import history from './history'

axios.interceptors.response.use(
  response => {
    if(response.data.msg === "请登录"){
      history.push('/index')
    }
    return response.data;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        default :
          history.push('/index');
        break;
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          history.push('/index');
        break;
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

window.axios = axios;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
