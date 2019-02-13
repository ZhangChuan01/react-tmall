import React, {Component} from 'react'
import "./home.less"
import { Carousel} from 'antd-mobile'
import images from '../../theme/image'
import BScroll from 'better-scroll'
import Cookies from 'js-cookie'
class Home extends Component{
  constructor(props) {
    super(props)
    this.state = {
      kindList: [],
      bannerList: [],
      menu: require("../../assets/menu.png"),
      logo: require("../../assets/tmall.png"),
      end: require("../../assets/end.png"),
      contentScroll: '',
      goodsList: [],
      alt: '图片加载失败',
      show: false,
      height: 0,
      islogin: false
    }
  }
  componentWillMount(){
    if(Cookies.get("userId")){
      this.setState({
        islogin: true
      })
    }else {
      this.setState({
        islogin: false
      })
    }
    this.initData();
  }
  componentDidMount(){
    let height = document.documentElement.clientHeight || document.body.clientHeight;
    this.setState({
      height: height
    })
    this.refs.contentWrapper.style.height = (height - 80) + "px";
    this.initScroll();
  }
  initData = async () =>{
    let response = await window.axios.get("/goods");
    this.setState({
      goodsList: response.res
    })
  }
  initScroll = () => {
    if(!this.state.contentScroll){
      let contentScroll = new BScroll(this.refs.contentWrapper,{
        click: true,
        probeType: 3
      });
      contentScroll.on("scrollEnd",() => {
        if(this.state.show){
          this.refs.tmall.style.display = 'none';
          this.refs.header.style.height = 50/3.75 + "vw";
          this.refs.ipt.style.width = "70%";
          this.refs.contentWrapper.style.height = (this.state.height - 50) + "px";
        }else {
          this.refs.tmall.style.display = 'block';
          this.refs.header.style.height = 80/3.75 + "vw";
          this.refs.ipt.style.width = "94%";
          this.refs.contentWrapper.style.height = (this.state.height - 80) + "px";
        }
      });
      contentScroll.on("scroll",(pos) => {
        let scrollTop = parseInt(-pos.y,10);
        if(scrollTop>50){
          this.setState({
            show: true
          })
        }else {
          this.setState({
            show: false
          })
        }
      });
      this.setState({
        contentScroll: contentScroll
      })
    }else {
      this.state.contentScroll.refresh();
    }
  }
  goodsDetail = index =>{
    this.props.history.push("/goodsDetail/" + index)
  }
  login = () => {
    this.props.history.push('./login')
  }
  render(){
    const {menu,logo,end,goodsList,alt,islogin} = this.state;
    return(
      <div id="home">
        <div className="header" ref="header">
          <div className="logo">
            <img className="menu" src={menu} alt={alt} />
            <img className="tmall" src={logo} alt={alt} ref="tmall"/>
            {islogin ? <i className="iconfont icon-ren"></i> : <span onClick={this.login}>登录</span>}
          </div>
          <input ref="ipt" type="text" placeholder="搜索商品"/>
        </div>
        <div className="contentWrapper" ref="contentWrapper">
          <div className="content">
            <div className="kindWrapper">
              {images.kindList.map((item,index) => (
                <div className="kind" key={index}>
                  <img src={item.url} alt={item.text}/>
                  <div>{item.text}</div>
                </div>
              ))}
            </div>
            <div>
              <Carousel autoplay={true} infinite={true}>
                {images.bannerList.map((item,index) => (
                  <img className="img" src={item.url} key={index} alt={alt} />
                ))}
              </Carousel>
            </div>
            <img className="banner" src={images.bannerGif} alt={alt} />
            <div className="office">
              <span>天猫官方直营</span>
              <span>官方直采·极速物流·售后无忧</span>
            </div>
            <div className="container">
              <div className="left" style={{background:`url(${images.offical.bg}) no-repeat top left`,
                backgroundSize: '100% 100%'}}>
                <p>超值专享·北京</p>
                <p>疯抢专享爆款</p>
                <p>限时特惠</p>
                <img src={images.offical.picture3} alt={alt} />
              </div>
              <div className="right">
                <div className="top">
                  <div className="text">
                    <img src={images.offical.title1} alt={alt}/>
                    <p>官方直采</p>
                    <img src={images.offical.discount} alt={alt}/>
                  </div>
                  <img src={images.offical.picture1} alt={alt}/>
                </div>
                <div className="bottom">
                  <div className="exp">
                    <img src={images.offical.title2} alt={alt}/>
                    <div>抢40元券</div>
                    <img src={images.offical.picture2} alt={alt}/>
                  </div>
                  <div className="exp">
                    <img src={images.offical.title1} alt={alt}/>
                    <div>抢40元券</div>
                    <img src={images.offical.picture4} alt={alt}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="goods">
              {goodsList.map((item,index) => (
                <div className="good" key={index}  onClick={this.goodsDetail.bind(this,index)}>
                  <div className="goodsInfo">
                    <div className="img">
                      <img src={images.goods[index]} alt={alt}/>
                    </div>
                    <div className="goodsName">{item.name}</div>
                    <div className="prompt">
                      {item.prompt.split(",").map((item2,index2) => (
                        <span key={index2}>{item2}</span>
                      ))}
                    </div>
                    <div className="sale">
                      <span>￥{item.price}</span>
                      <i className="iconfont icon-gouwuche"></i>
                    </div>
                  </div>
                  <div className="goodsRemake">
                    <span className={item.remark === 1 ? 'remake': ''}>[{item.remarkType}]</span>
                    <span>{item.remarkText}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="end" style={{background: `#ddd url(${end}) no-repeat center center`,
              backgroundSize: `100%`}}></div>
            <div className="footer">
              <img src={images.footer[0]} alt={alt} />
              <img src={images.footer[1]} alt={alt} />
              <img src={images.footer[2]} alt={alt} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;