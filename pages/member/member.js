const App = getApp();
Page({
    data: {
        isLoading: true,
        reLoading: false,
        isLogin: true,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let _this = this;
        _this.getUserDetail();

    },

    // 获取用户信息判断登陆状态
    getUserDetail() {
        let _this = this;
        App._get('user.index/detail', {}, function (result) {
            // 记录登陆状态
            if (result.data.userInfo) {
                _this.setData({isLogin: true})
                _this.setData(result.data);
            } else {
                _this.setData({isLogin: false})
            }
        }, false, () => {
            _this.setData({
                isLoading: false,
                reLoading: false,
            })
        });
    },

    // 退出登陆
    outLogin() {
        wx.setStorageSync('token', '');
        wx.setStorageSync('user_id', '');
        wx.switchTab({
            url: '/pages/index/index',
            success: function () {
                wx.showToast({
                    title: '退出成功'
                })
            }
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    // 获取用户手机号
    getPhoneNumber(e){
        App._post_form('user.index/getUserPhone',{
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv,
        });
    }
})
