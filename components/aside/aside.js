const app = getApp();
Component({
    properties: {
        buyRule : {
            type: String,
            value: '购买规则'
        },
        returnRule : {
            type: String,
            value: '购买规则'
        },
        isRuleShow : {
            type: Boolean,
            value: true
        }
    },
    data: {
        isShow: false
    },
    methods: {
        showRule: function () {
            this.setData({
                isShow : true,
                isRuleShow: true
            });
        },
        closeRule : function (e) {
            this.setData({
                isShow : false,
                isRuleShow: false
            });
        }
    }
})