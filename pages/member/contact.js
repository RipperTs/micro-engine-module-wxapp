//news-list.js
//获取应用实例
const App = getApp()
Page({
    data: {
        isLoading: true,
        reLoading: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.getAbout();
    },

    // 获取关于我们
    getAbout: function () {
        let _this = this;
        App._get('wxapp/about', {}, (res) => {
            _this.setData(res.data)
        }, false, () => {
            _this.setData({
                isLoading: false,
                reLoading: false,
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


})
