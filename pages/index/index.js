const App = getApp();
Page({
    data: {
        isLoading: true,
        reLoading: false,
        bannerList: [],
        featuresList: [],
        articleList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        let scene = App.getSceneData(options);
        App.onStartupScene(options);
        _this.getBanner();
        _this.getFeatures();
        _this.getArticle();
        _this.setReferee(scene);
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let _this = this;
    },

    // 设置分销下级
    setReferee(scene) {
        if (wx.getStorageSync('token') && scene.uid) {
            App._get('user/bindReferee', {
                referee_id: scene.uid,
            });
            return false
        }
    },

    // 获取首页模块
    getFeatures() {
        let _this = this;
        App._get('features/index', {}, res => {
            _this.setData(res.data)
        });
    },

    // 获取banner
    getBanner() {
        let _this = this;
        App._get('wxapp/banner', {}, res => {
            _this.setData(res.data)
        });
    },

    // 获取热门文章
    getArticle() {
        let _this = this;
        App._get('article/lists', {
            is_recommend: 1,
            limit: 6,
        }, res => {
            _this.setData({
                articleList: res.data.list.data
            })
        }, false, () => {
            _this.setData({
                isLoading: false,
                reLoading: false,
            })
        });
    },

    // 去新增赋能
    toGenerate(e) {
        let _this = this,
            id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/generate/create?features_id=' + id
        })
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
        // this.ajaxloading = this.selectComponent("#ajax_loading");
        // if (this.data.current_page >= this.data.last_page) {
        //     this.ajaxloading.AjaxLoading(true);
        //     this.ajaxloading.AjaxNoresult(false);
        //     return false;
        // }
        // this.getNewGoods(this.data.current_page + 1);
        // this.ajaxloading.AjaxLoading(false);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {

    },

})
