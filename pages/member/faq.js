//news-list.js
//获取应用实例
const App = getApp()
const animation = wx.createAnimation();
Page({
    data: {
        skeletonHave: true, //骨架屏处理
        skeleton: true, //骨架屏处理
        faqList: [], // 帮助列表
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let _this = this;
        //骨架屏
        setTimeout(() => {
            _this.setData({
                skeleton: false
            })
            setTimeout(() => {
                _this.setData({
                    skeletonHave: false
                })
            }, 400)
        }, 500)
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 获取帮助列表
        this.getHelpList();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 获取帮助列表
     */
    getHelpList: function () {
        let _this = this;
        App._get('wxapp/help', {}, function (result) {
            var list = result.data.list;
            console.log(list);
            var faqList = [];
            for (let i = 0; i < list.length; i++) {
                faqList[i] = {
                    'title': list[i].title,
                    'content': list[i].content,
                    'status': i == 0 ? true : false
                }
            }
            _this.setData({
                faqList: faqList
            })
        });
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {

    },
    /**
     * 展开状态切换事件
     */
    statusChange: function (e) {
        let _this = this;
        let index = e.currentTarget.dataset.index;
        _this.data.faqList.forEach(element => {
            element.status = false;
        });
        _this.data.faqList[index].status = true;
        _this.setData({
            faqList: _this.data.faqList
        });
    },
})
