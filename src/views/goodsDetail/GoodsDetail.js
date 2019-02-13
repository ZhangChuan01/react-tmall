import React, {Component} from 'react'
import "./goodsDetail.less"
import images from '../../theme/image'
import Header from '../../components/Header'
import BScroll from 'better-scroll'
import {Modal} from 'antd-mobile'

class GoodsDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alt: '图片加载失败',
      index: 0,
      goodsInfo: {},
      evaluate: [
        {
          text: "便宜(19733)",
          rating: 4
        },
        {
          text: "快递不错(14300)",
          rating: 5
        },
        {
          text: "质量很好(9253)",
          rating: 5
        },
        {
          text: "味道不错(8070)",
          rating: 4
        },
        {
          text: "人群(4728)",
          rating: 4
        },
        {
          text: "质量一般(1070)",
          rating: 3
        }
      ],
      tabList: ["商品", "评价", "详情"],
      scrollTop: 0,
      actived: 0,
      windowHeight: 0,
      voucherModal: false,
      selectModal: false,
      shop: [
        {
          price: 10,
          totalPrice: 199
        },
        {
          price: 10,
          totalPrice: 199
        },
        {
          price: 20,
          totalPrice: 399
        },
        {
          price: 50,
          totalPrice: 599
        }
      ],
      list: [],
      num: 1,
      price: 0,
      stock: 0,
      selectInfo: '',
      noStockFlag: [],
      goodsData: [],
      noStockList: [],
      flagList: [],
      smallImg: 0,
      selectList: []
    }
  }

  componentWillMount() {
    this.initData();
  }

  componentDidMount() {
    let height = document.documentElement.clientHeight || document.body.clientHeight;
    this.refs.goodsInfo.style.height = height + "px";
    this.setState({
      windowHeight: height
    })
    this.initScroll();
  }

  initScroll = () => {
    if (!this.state.contentScroll) {
      let contentScroll = new BScroll(this.refs.goodsInfo, {
        click: true,
        probeType: 3
      });
      let scrollTop = 0, actived = 0;
      contentScroll.on("scroll", (pos) => {
        scrollTop = pos.y;
        if (pos.y < -500 && pos.y > -750) {
          actived = 1
        } else if (pos.y > -501) {
          actived = 0
        } else {
          actived = 2
        }
        this.setState({
          scrollTop: scrollTop,
          actived: actived
        })
      })
      this.setState({
        contentScroll: contentScroll
      })
    } else {
      this.state.contentScroll.refresh();
    }
  }

  initData = async () => {
    let index = parseInt(this.props.match.params.gid, 10);
    let gid = index + 1;
    let Data1 = await window.axios.get('/goods/detail?goodId=' + gid);
    let res1 = Data1.res;
    let Data2 = await window.axios.get("/goods/detail/selectInfo",{
      params: {
        gId: gid
      }
    });
    let res = Data2.res;
    let arr = res[0].kind.split(",");
    let list = [],noStockList = [],flagList = [],noStockFlag = [];
    arr.forEach(item => {
      let obj = {};
      obj.title = item;
      obj.val = [];
      list.push(obj)
    })
    res.forEach(item => {
      if(item.stock === 0){
        noStockList.push(item.info);
      }
      let arr = item.info.split(",");
      arr.forEach((item2,index2) => {
        if(list[index2].val.indexOf(item2)<0){
          list[index2].val.push(item2);
        }
      })
    })
    list.forEach((item,index) => {
      let obj = {
        index: -1,
        content: ''
      };
      flagList.push(obj);
      let num = [];
      noStockFlag.push(num);
      item.val.forEach(() => {
        noStockFlag[index].push(false);
      })
    })
    if(list.length === 1){
      list[0].val.forEach((item,index) => {
        noStockList.forEach(item2 => {
          if(item2.indexOf(item) > -1){
            noStockFlag[0][index] = true
          }
        })
      })
    }else {
      list.forEach((item1,index1) => {
        item1.val.forEach((item2,index2) => {
          list.forEach((item3,index3) => {
            if(index1 !== index3){
              let x = 0;
              item3.val.forEach(item4 => {
                noStockList.forEach(item5 => {
                  if(item5.indexOf(item4) > -1 && item5.indexOf(item2) > -1){
                    x++
                  }
                })
              })
              if(x === item3.val.length){
                noStockFlag[index1][index2] = true
              }
            }
          })
        })
      })
    }
    let info = '请选择: ';
    if(!this.state.selectInfo){
      list.map(item => {
        return info += item.title + ' '
      })
    }
    this.setState({
      index: index,
      goodsInfo: res1,
      price: res1.price,
      goodsData: res,
      list: list,
      noStockList: noStockList,
      flagList: flagList,
      noStockFlag: noStockFlag,
      selectInfo: info
    })
  }

  scrollTo = index => {
    switch (index) {
      case 0:
        this.state.contentScroll.scrollToElement(this.refs.banner, 1000, 0, -50);
        break;
      case 1:
        this.state.contentScroll.scrollToElement(this.refs.evaluate, 1000, 0, -50);
        break;
      case 2:
        this.state.contentScroll.scrollToElement(this.refs.detail, 1000, 0, -50);
        break;
      default :
        break;
    }
  }

  showVoucherModel = () => {
    this.setState({
      voucherModal: !this.state.voucherModal
    }, () => {
      if (!this.state.voucherScroll) {
        let voucherScroll = new BScroll(this.refs.voucherModal, {
          click: true,
          probeType: 3
        });
        this.setState({
          voucherScroll: voucherScroll
        })
      } else {
        this.state.voucherScroll.scrollTo(0, 0);
      }
    })
  }

  showSelectModel = () => {
    this.setState({
      selectModal: !this.state.selectModal
    },() => {
      if(!this.state.selectScroll){
        let selectScroll = new BScroll(this.refs.scrollWrapper,{
          click: true,
          probeType: 3
        });
        this.setState({
          selectScroll: selectScroll
        })
      }else {
        this.state.selectScroll.scrollTo(0,0);
      }
    })
  }
  nostock = (index,content,arr) => {
    let noStockFlag = this.state.noStockFlag;
    this.state.list.forEach((item,index1) => {
      if(index1 !== index){
        item.val.forEach((item2,index2) => {
          noStockFlag[index1][index2] = false;
          arr.forEach((item3) => {
            if(item3.indexOf(item2)>-1 && item3.indexOf(content)>-1){
              noStockFlag[index1][index2] = true;
            }
          })
        })
      }
    })
    this.setState({
      noStockFlag: noStockFlag
    })
  }
  getStock = info => {
    let infoArr = info.split(" ").toString();
    this.state.goodsData.forEach(item => {
      if(infoArr.indexOf(item.info)>-1){
        this.setState({
          stock: item.stock,
          price: item.price
        },() => {
          this.checkNum();
        })
        return;
      }
    })
  }
  select = (index,val,content,flag) => {
    if(flag) return;
    let flagList = this.state.flagList;
    flagList[index].index = val;
    flagList[index].content = content;
    if(index === 0){
      this.setState({
        smallImg: val
      })
    }
    let select = flagList.every(item => {
      return item.index !== -1;
    })
    let info = '';
    if(select){
      info = '已选择: ';
      flagList.forEach(item => {
        info += item.content+" "
      })
    }else {
      info = '请选择: ';
      flagList.forEach((item,index) => {
        if(item.index === -1){
          info += this.state.list[index].title
        }
      })
    }
    let arr = [];
    this.state.noStockList.forEach(item => {
      if(item.indexOf(content)>-1){
        arr.push(item);
      }
    })
    this.nostock(index,content,arr);
    this.getStock(info);
    this.setState({
      flagList: flagList,
      selectInfo: info
    })
  }
  close = () => {
    this.setState({
      voucherModal: false,
      selectModal: false
    })
  }
  checkNum = () => {
    let num = this.state.num;
    if(num > this.state.stock) {
      num = this.state.stock;
      this.setState({
        num: num
      })
    }
    if(!num || num < 1){
      this.setState({
        num: 1
      })
    }
  }
  changeNum = str => {
    let num = this.state.num;
    if(str === 'add'){
      if(num >= this.state.stock) return;
      num ++
      this.setState({
        num: num
      })
    }else {
      if(num <= 1) return;
      num --
      this.setState({
        num: num
      })
    }
  }
  updateNum = event => {
    if(event.target.value){
      let reg = /[0-9]+/;
      let finalVal = '';
      for (let val of event.target.value){
        if(reg.test(val)){
          finalVal += val
        }
      }
      finalVal = parseInt(finalVal,10).toString();
      this.setState({
        num: finalVal
      })
    }else {
      this.setState({
        num: event.target.value
      })
    }
  }
  toIndex = () => {
    this.props.history.push('/index')
  }
  render() {
    const {alt,index,goodsInfo,evaluate,tabList,scrollTop,actived,windowHeight,voucherModal,
      selectModal,shop,list,num,price,stock,selectInfo,noStockFlag,flagList,smallImg} = this.state;

    let history = this.props.history;
    return (
      <div className="goodsDetail">
        <Header history={history}></Header>
        {scrollTop < -70 ?
          <div className="header2">
            <div className="back" onClick={this.toIndex}>
              <i className="iconfont icon-xiangzuo"></i>
            </div>
            <div className="tab">
              {tabList.map((item, index) => (
                <div className={index === actived ? 'actived' : ''} onClick={this.scrollTo.bind(this, index)}
                     key={index}>{item}</div>
              ))}
            </div>
            <div className="cart">
              <i className="iconfont icon-gouwuche"></i>
            </div>
          </div> : ''
        }
        <div className="goodsInfo" ref='goodsInfo'>
          <div className="content">
            <img ref='banner' className='banner' src={images.goodsDetail[index].big} alt={alt}/>
            <div className="text">
              <div className="name">{goodsInfo.name}</div>
              <div className="realityPrice">
                <div>￥<span>{goodsInfo.price}</span></div>
                <div>品牌促销</div>
              </div>
              <div className="price">
                <span>价格:</span>
                <span>{goodsInfo.price2}</span>
              </div>
              <div className="info">
                <div className="express">
                  <span>快递:</span>
                  <span>0.00</span>
                </div>
                <div className="count">
                  <span>月销量:</span>
                  <span>{goodsInfo.sales}件</span>
                </div>
                <div className="place">{goodsInfo.place}</div>
              </div>
            </div>
            <div className="voucherWrapper" onClick={this.showVoucherModel}>
              <div className="left">
                <div className="voucher">
                  <img src={images.quan1} alt={alt}/>
                  <span>全天猫实物商品通用</span>
                </div>
                <div className="voucher">
                  <img src={images.quan2} alt={alt}/>
                  <span>领取优惠券</span>
                </div>
              </div>
              <div className="right">领取</div>
            </div>
            <div className="select" onClick={this.showSelectModel}>
              <div className="left">{selectInfo}</div>
            </div>
            <div ref='evaluate' className="evaluate">
              <div className="title">商品评价(556248)</div>
              {evaluate.map((item, index) => (
                <div className={`evaluateDetail ${item.rating < 4 ? 'badEvaluate' : ''}`} key={index}>{item.text}</div>
              ))}
              <img src={images.p} alt={alt}/>
              <div className="text">我是我们村第一个在淘宝上买东西的人。这里大部分人是不网 购的。他们买东西价格一般不超过五块，听说我在淘宝买东西 后，整个村都震惊了，村长跑到我家里对我爸说我是不是疯了，
                老公跟我闹离婚，说这日子没法过了。面对重重压力，我坚持 要买。我相信我这个月的工资不会白花，终于快递我怀揣着激 动的心情，颤抖的打开包裹，那到了，一霎那，感觉我的眼都
                要亮瞎了，啊这颜值这手感，只怪我读书少，这质量无法 用华丽的语整个言来形容它。我举着它，骄傲的站在村口，村 都沸腾了，更有人喊，我不给他们看，他们就跳井。吓得我
                赶紧收起宝贝，挤出人群落荒而逃。为测试宝贝效果，我立刻 去我们村高达100米山上村长家客厅里用。用完后，在全村人 羡慕的目光中，仰首挺胸扬长而去。
              </div>
              <div className="time">2018-05-26</div>
              <div className="moreEvaluate">
                <span>查看更多评价</span>
              </div>
            </div>
            <div className="detail" ref="detail">
              <div className="title">
                <div className="line"></div>
                <div>详情</div>
                <div className="line"></div>
              </div>
              <div className="showImg"><span>商品图片</span></div>
              <div className="imgContainer">
                <img src={images.good1detail1} alt={alt}/>
                <img src={images.good1detail2} alt={alt}/>
                <img src={images.good1detail3} alt={alt}/>
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="left">
              <div className="store">
                <i className="iconfont icon-dianpu"></i>
                <div>店铺</div>
              </div>
              <div className="people">
                <i className="iconfont icon-kefu" style={{color: '#3a8ee6'}}></i>
                <div>客服</div>
              </div>
              <div className="collection">
                <i className="iconfont icon-favorite_diss"></i>
                <div>收藏</div>
              </div>
            </div>
            <div className="right">
              <div className="addCart">加入购物车</div>
              <div className="buy">立即购买</div>
            </div>
          </div>
        </div>
        <Modal popup={true} onClose={this.close} visible={voucherModal} animationType="slide-up">
          <div className="voucherModel" ref='voucherModal' style={{height: `${windowHeight * 0.6}px`}}>
            <div>
              <div className="tmall">
                <div className="title">天猫购物券</div>
                <div className="info" style={{backgroundImage: `url(${images.tmall})`}}>
                  <div className="left">
                    <div>天猫购物券</div>
                    <div>100%刮中奖 最高50元</div>
                    <div>有效期：7天</div>
                  </div>
                  <div className="lineWrapper">
                    <div className="line"></div>
                  </div>
                  <div className="right">
                    <div>200积分</div>
                    <div>兑换</div>
                    <div>兑换机会：8次</div>
                  </div>
                </div>
                <div className="tip">全天猫实物商品通用</div>
              </div>
              <div className="shop">
                <div className="title">店铺优惠券</div>
                {shop.map((item, index) => (
                  <div className="info" key={index}>
                    <div className="left">
                      <div><span>￥</span>{item.price}</div>
                      <div>满{item.totalPrice}使用</div>
                      <div>有效期 2018.05.15-2018.08.31</div>
                    </div>
                    <div className="lineWrapper">
                      <div className="line"></div>
                    </div>
                    <div className="right">
                      <div>立即领取</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
        <Modal popup={true} onClose={this.close} visible={selectModal} animationType="slide-up">
          <div className="selectModel">
            <div className="content">
              <div className="header">
                <div className="imgContainer">
                  {images.goodsDetail[index].small.map((item,index) => (
                    smallImg === index ? <img src={item} alt={alt} key={index} /> : ''
                    ))}
                </div>
                <div className="selectInfo">
                  <div className="price">￥{price}</div>
                  {selectInfo.indexOf('已选择') > -1 ?
                    <div className="stock">库存 {stock}</div> :
                    <div className="stock">有货</div>
                  }
                  <div className="stock">{selectInfo}</div>
                </div>
                <div className="close" onClick={this.close}>×</div>
            </div>
            <div className="scrollWrapper" ref="scrollWrapper" style={{overflow: 'hidden',height:`${windowHeight*0.7*0.72}px`}}>
              <div className="selectScroll">
                {list.map((item,index) => (
                  <div className="goodsInfos" key={index}>
                    <div>{item.title}</div>
                    <div className="list">
                      {item.val.map((item2,index2) => (
                        <span className={`btn ${noStockFlag[index][index2] ? 'nostock' : ''} ${flagList[index].index === index2 ? 'checked' : ''}`} onClick={this.select.bind(this,index,index2,item2,noStockFlag[index][index2])} key={index2}>{item2}</span>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="count">
                  <span>购买数量</span>
                  <div className="changeNum">
                    <i className='iconfont icon-jianhao' onClick={this.changeNum.bind(this,'reduce')}></i>
                    <input type="number" value={num} onBlur={this.checkNum} onChange={this.updateNum} />
                    <i className='iconfont icon-jiahao' onClick={this.changeNum.bind(this,'add')}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btnGroup">
            <div className="add">加入购物车</div>
            <div className="buy">立即购买</div>
          </div>
      </div>
  </Modal>
  </div>
    )
  }
  }

  export default GoodsDetail;