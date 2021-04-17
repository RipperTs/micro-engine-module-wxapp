// components/ajax_loading/ajax_loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadingsrc:{
      type:String,
      value:''
    },
    color:{
        type:String,
        value:'#999'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    botloadinghidden:true,
    botnoresulthidden:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    AjaxLoading:function(e){
      this.setData({
        botloadinghidden:e
      })
    },
    AjaxNoresult:function(e){
      this.setData({
        botnoresulthidden: e
      })
    },
  }
})
