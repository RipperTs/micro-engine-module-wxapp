const app = getApp();
Component({
    properties: {
        navigationBarTitle: {
            type: String,
            value: ''
        },
        back: {
            type: Boolean,
            value: false
        },
        home: {
            type: Boolean,
            value: false
        },
        backUrl : {
            type: String,
            value: '/pages/index/index'
        }
    },
    data: {
        statusBarHeight: app.globalData.statusBarHeight
    },
    methods: {
        backHome: function () {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        },
        back: function (e) {
            wx.reLaunch({
                url: e.currentTarget.dataset.url,
            })
        }
    }
})