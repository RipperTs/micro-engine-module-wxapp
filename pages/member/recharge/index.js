const App = getApp();

// 枚举类：充值类型
import RechargeTypeEnum from '../../../utils/enum/recharge/order/RechargeType.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}, // 用户信息
        setting: {}, // 充值设置

        // recharge_type: '', // 充值类型
        selectedPlanId: 0, // 当前选中的套餐id
        inputValue: '', // 自定义金额
        type: 10,
        disabled: false, //按钮禁用
        isLoading: true,
        reLoading: false,
        btn_text: '立即充值',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let _this = this;
        _this.setData({
            type: options.type,
            btn_text: options.type == 10 ? '立即充值' : '立即开通'
        })
        // 获取充值中心数据
        _this.getRechargeIndex();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let _this = this;
        // 验证客户端版本
        _this.getSystemInfo();
    },


    getSystemInfo() {
        let _this = this;
        App._get('wxapp/checkSystemInfo', {}, res => {
            if (res.data.status == 1) {
                _this.checkSystemInfo();
            }
        });
    },

    // 检查用户端系统(ios做屏蔽处理)
    checkSystemInfo() {
        let _this = this;
        let systemInfo = wx.getSystemInfoSync();
        if (systemInfo.platform == 'ios') {
            _this.setData({
                btn_text: 'iOS充值功能暂不可用',
                disabled: true,
                isLoading: false,
                reLoading: false,
            })
            wx.showModal({
                title: '温馨提示',
                content: '基于苹果运营规范，小程序内暂不支持iOS端虚拟支付业务。',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                }
            })
            return false;
        }
    },

    /**
     * 获取充值中心数据
     */
    getRechargeIndex() {
        let _this = this;
        App._get('recharge/index', {
            type: _this.data.type
        }, function (result) {
            _this.setData(result.data);
            if (_this.data.type == 20 && result.data.setting.is_vip == 0) {
                wx.showModal({
                    title: '温馨提示',
                    content: '管理员已禁止开通会员功能,您可以选择充值余额后再进行赋能操作!',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: '/pages/member/member'
                            })
                        }
                    }
                })
            }
        }, false, () => {
            _this.setData({
                isLoading: false,
                reLoading: false,
            })
        });
    },

    /**
     * 选择充值套餐
     */
    onSelectPlan(e) {
        let _this = this;
        _this.setData({
            selectedPlanId: e.currentTarget.dataset.id,
            inputValue: ''
        });
    },

    /**
     * 绑定金额输入框
     */
    bindMoneyInput(e) {
        let _this = this;
        _this.setData({
            inputValue: e.detail.value,
            selectedPlanId: 0
        })
    },

    /**
     * 立即充值
     */
    onSubmit(e) {
        let _this = this;

        // 记录formid
        App.saveFormId(e.detail.formId);

        // 按钮禁用
        _this.setData({
            disabled: true,
            reLoading: true,
        });
        // 提交到后端
        App._post_form('recharge/submit', {
            planId: _this.data.selectedPlanId,
            customMoney: _this.data.inputValue,
            type: _this.data.type,
        }, (result) => {

            // 发起微信支付
            App.wxPayment({
                payment: result.data.payment,
                success() {
                    App.showSuccess(result.msg.success, () => {
                        wx.navigateBack();
                    });
                },
                fail(res) {
                    App.showError(result.msg.error);
                },
                complete(res) {

                }
            });

        }, false, () => {
            // 解除禁用
            _this.setData({
                disabled: false,
                reLoading: false,
            });
        });
    },


})
