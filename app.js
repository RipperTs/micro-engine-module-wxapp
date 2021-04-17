/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 * @沈阳创彩科技有限公司
 * E-mail:wangyifani@foxmail.com
 */
const tabBarLinks = [
    'pages/index/index',
    'pages/article/index',
    'pages/member/member'
];

// 站点配置文件

import siteinfo from './siteinfo.js';

// 工具类
import util from './utils/util.js';

// 微擎模块名
const moduleName = 'empower_tool';

App({

    /**
     * 全局变量
     */
    globalData: {
        user_id: null,
    },
    // siteInfo: require('siteinfo.js'),
    // 组合api地址
    api_root: siteinfo.siteroot + '?m=' + moduleName + '&c=entry&a=wxapp&i=' + siteinfo.uniacid + '&version=' + siteinfo.version + '&do=api&tpp=/',

    /**
     * 生命周期函数--监听小程序初始化
     */
    onLaunch(e) {
        let _this = this;
        // 小程序主动更新
        _this.updateManager();
        // 小程序启动场景
        _this.onStartupScene(e.query);
        // 适配全面屏
        _this.checkFullSucreen();
    },

    /**
     * 判断设备是否为全面屏
     */
    checkFullSucreen: function () {
        const self = this
        wx.getSystemInfo({
            success: function (res) {
                // 根据 屏幕高度 进行判断
                if (res.screenHeight - res.windowHeight - res.statusBarHeight - 32 > 72) {
                    self.globalData.isFullSucreen = true
                }
                // 根据手机型号匹配
                if (res.model.search('iPhone X') != -1) {
                    self.globalData.isFullSucreen = true
                }
            }
        })
    },


    /**
     * 小程序启动场景
     */
    onStartupScene(query) {
        // 获取场景值
        let scene = this.getSceneData(query);
        // 记录推荐人id
        let refereeId = query.referee_id ? query.referee_id : scene.uid;
        refereeId > 0 && (this.saveRefereeId(refereeId));
    },

    /**
     * 获取商城ID
     */
    getWxappId() {
        return 10001;
    },

    /**
     * 记录推荐人id
     */
    saveRefereeId(refereeId) {
        if (!wx.getStorageSync('referee_id')) {
            wx.setStorageSync('referee_id', refereeId);
        }
        console.log(refereeId);
    },

    /**
     * 获取场景值(scene)
     */
    getSceneData(query) {
        return query.scene ? util.scene_decode(query.scene) : {};
    },

    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow(options) {
        // 获取小程序基础信息
        // this.getWxappBase();
    },

    /**
     * 执行用户登录
     */
    doLogin(delta) {
        // 保存当前页面
        let pages = getCurrentPages();
        if (pages.length) {
            let currentPage = pages[pages.length - 1];
            "pages/login/login" != currentPage.route &&
            wx.setStorageSync("currentPage", currentPage);
        }
        // 跳转授权页面
        wx.navigateTo({
            url: "/pages/login/login?delta=" + (delta || 1)
        });
    },

    /**
     * 当前用户id
     */
    getUserId() {
        return wx.getStorageSync('user_id');
    },

    /**
     * 显示成功提示框
     */
    showSuccess(msg, callback) {
        wx.showToast({
            title: msg,
            icon: 'success',
            mask: true,
            duration: 1500,
            success() {
                callback && (setTimeout(function () {
                    callback();
                }, 1500));
            }
        });
    },

    /**
     * 显示失败提示框
     */
    showError(msg, callback) {
        wx.showModal({
            title: '友情提示',
            content: msg,
            showCancel: false,
            success(res) {
                // callback && (setTimeout(function() {
                //   callback();
                // }, 1500));
                callback && callback();
            }
        });
    },

    /**
     * get请求
     */
    _get(url, data, success, fail, complete, check_login) {
        wx.showNavigationBarLoading();
        let _this = this;
        // 构造请求参数
        data = data || {};
        data.wxapp_id = _this.getWxappId();

        // if (typeof check_login === 'undefined')
        //   check_login = true;

        // 构造get请求
        let request = function () {
            data.token = wx.getStorageSync('token');
            wx.request({
                url: _this.api_root + url,
                header: {
                    'content-type': 'application/json'
                },
                data: data,
                success(res) {
                    if (res.statusCode !== 200 || typeof res.data !== 'object') {
                        console.log(res);
                        _this.showError('网络请求出错');
                        return false;
                    }
                    if (res.data.code === -1) {
                        // 登录态失效, 重新登录
                        wx.hideNavigationBarLoading();
                        _this.doLogin(2);
                    } else if (res.data.code === 0) {
                        _this.showError(res.data.msg, function () {
                            fail && fail(res);
                        });
                        return false;
                    } else {
                        success && success(res.data);
                    }
                },
                fail(res) {
                    _this.showError(res.errMsg, function () {
                        fail && fail(res);
                    });
                },
                complete(res) {
                    wx.hideNavigationBarLoading();
                    complete && complete(res);
                },
            });
        };
        // 判断是否需要验证登录
        check_login ? _this.doLogin(request) : request();
    },

    /**
     * post提交
     */
    _post_form(url, data, success, fail, complete, isShowNavBarLoading) {
        let _this = this;

        isShowNavBarLoading || true;
        data.wxapp_id = _this.getWxappId();
        data.token = wx.getStorageSync('token');

        // 在当前页面显示导航条加载动画
        if (isShowNavBarLoading == true) {
            wx.showNavigationBarLoading();
        }
        wx.request({
            url: _this.api_root + url,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: data,
            success(res) {
                if (res.statusCode !== 200 || typeof res.data !== 'object') {
                    _this.showError('网络请求出错');
                    return false;
                }
                if (res.data.code === -1) {
                    // 登录态失效, 重新登录
                    wx.hideNavigationBarLoading();
                    _this.doLogin(1);
                    return false;
                } else if (res.data.code === 0) {
                    _this.showError(res.data.msg, function () {
                        fail && fail(res);
                    });
                    return false;
                }
                success && success(res.data);
            },
            fail(res) {
                // console.log(res);
                _this.showError(res.errMsg, function () {
                    fail && fail(res);
                });
            },
            complete(res) {
                wx.hideNavigationBarLoading();
                // wx.hideLoading();
                complete && complete(res);
            }
        });
    },

    /**
     * 验证是否存在user_info
     */
    validateUserInfo() {
        let user_info = wx.getStorageSync('user_info');
        return !!wx.getStorageSync('user_info');
    },

    /**
     * 小程序主动更新
     */
    updateManager() {
        if (!wx.canIUse('getUpdateManager')) {
            return false;
        }
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            // console.log(res.hasUpdate)
        });
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，即将重启应用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            });
        });
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
            })
        });
    },

    /**
     * 获取tabBar页面路径列表
     */
    getTabBarLinks() {
        return tabBarLinks;
    },

    /**
     * 跳转到指定页面
     * 支持tabBar页面
     */
    navigationTo(url) {
        if (!url || url.length == 0) {
            return false;
        }
        let tabBarLinks = this.getTabBarLinks();
        // tabBar页面
        if (tabBarLinks.indexOf(url) > -1) {
            wx.switchTab({
                url: '/' + url
            });
        } else {
            // 普通页面
            wx.navigateTo({
                url: '/' + url
            });
        }
    },

    /**
     * 记录formId
     * (因微信模板消息已下线，所以formId取消不再收集)
     */
    saveFormId(formId) {
        return true;
        // let _this = this;
        // console.log('saveFormId');
        // if (formId === 'the formId is a mock one') {
        //   return false;
        // }
        // _this._post_form('wxapp.formId/save', {
        //   formId: formId
        // }, null, null, null, false);
    },

    /**
     * 生成转发的url参数
     */
    getShareUrlParams(params) {
        let _this = this;
        return util.urlEncode(Object.assign({
            referee_id: _this.getUserId()
        }, params));
    },

    /**
     * 发起微信支付
     */
    wxPayment(option) {
        let options = Object.assign({
            payment: {},
            success: () => {
            },
            fail: () => {
            },
            complete: () => {
            },
        }, option);
        wx.requestPayment({
            timeStamp: options.payment.timeStamp,
            nonceStr: options.payment.nonceStr,
            package: 'prepay_id=' + options.payment.prepay_id,
            signType: 'MD5',
            paySign: options.payment.paySign,
            success(res) {
                options.success(res);
            },
            fail(res) {
                options.fail(res);
            },
            complete(res) {
                options.complete(res);
            }
        });
    },

    /**
     * 验证登录
     */
    checkIsLogin() {
        return wx.getStorageSync('token') != '' && wx.getStorageSync('user_id') != '';
    },

    /**
     * 授权登录
     */
    getUserInfo(e, callback) {
        let App = this;
        if (e.detail.errMsg !== 'getUserInfo:ok') {
            return false;
        }
        wx.showLoading({
            title: "正在登录",
            mask: true
        });
        // 执行微信登录
        wx.login({
            success(res) {
                // 发送用户信息
                App._post_form('user/login', {
                    code: res.code,
                    user_info: e.detail.rawData,
                    encrypted_data: e.detail.encryptedData,
                    iv: e.detail.iv,
                    signature: e.detail.signature,
                    referee_id: wx.getStorageSync('referee_id')
                }, result => {
                    // 记录token user_id
                    wx.setStorageSync('token', result.data.token);
                    wx.setStorageSync('user_id', result.data.user_id);
                    // 执行回调函数
                    callback && callback();
                }, false, () => {
                    wx.hideLoading();
                });
            }
        });
    },

});
