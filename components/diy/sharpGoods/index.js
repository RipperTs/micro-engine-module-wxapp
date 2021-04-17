const App = getApp();

// 工具类
import util from '../../../utils/util.js';

// 倒计时插件
import CountDown from '../../../utils/countdown.js';

// 枚举类：秒杀活动商品状态
import ActiveStatusEnum from '../../../utils/enum/sharp/GoodsStatus.js';

Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    data: Object,
  },

  /**
   * 组件私有属性
   */
  data: {
    ActiveStatusEnum, // 秒杀活动商品状态
    countDownList: [], // 倒计时
  },

  /**
   * 组件生命周期声明对象
   */
  lifetimes: {

    /**
     * 在组件实例进入页面节点树时执行
     */
    attached() {
      let _this = this;
      _this._initCountDownData();
    },

  },



  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {


    /**
     * 跳转商品详情页
     */
    _onTargetGoods(e) {
      // 记录formid
      App.saveFormId(e.detail.formId);
      // 生成query参数
      let _this = this,
        query = util.urlEncode({
          active_time_id: _this.data.data.active.active_time_id,
          sharp_goods_id: e.detail.target.dataset.id,
        });
      // 跳转到商品详情页
      wx.navigateTo({
        url: `/pages/sharp/goods/index?${query}`,
      });
    },

    /**
     * 更多秒杀
     */
    _onTargetSharpIndex(e) {
      // 记录formid
      App.saveFormId(e.detail.formId);
      // 跳转到秒杀会场首页
      wx.navigateTo({
        url: `/pages/sharp/index/index`,
      });
    },

    /**
     * 初始化倒计时组件
     */
    _initCountDownData(data) {
      let _this = this,
        active = _this.data.data.active;
      if (!active) return false;
      // 记录倒计时的时间
      _this.setData({
        [`countDownList[0]`]: {
          date: active.count_down_time,
        }
      });
      // 执行倒计时
      CountDown.onSetTimeList(_this, 'countDownList');
    },
  }

})