[TOC]

### 小程序目录结构
```
front
├─ components                                公共组件目录
├─ dist                                		     第三方组件库(有赞UI)
├─ iconfont                                	  阿里图标库
├─ images                                		图片资源
├─ pages                                		 前端页面文件(遵循小程序目录结构规范)
├─ utils                                		   自封工具类库
├─ wxParse                                	  展示html实体化工具(微信官方)
├─ app.js                                		(需严格修改此文件，否则微擎无法上传过审)
├─ app.json                                		
├─ app.wxss                                		
├─ project.config.json                               		
├─ siteinfo.js                               	微擎配置文件(必须存在，且格式字段必须一样)
└─ sitemap.json                                  前端接口入口模块
```


### 文件调整
> 以下文件调整在会放出完整文件示例，可下载附件查看。

##### app.js文件调整
**定义应用模块名(每个新应用都需要更改此处)**
```javascript
// 微擎模块名
const moduleName = 'empower_tool';
```

```javascript
// siteInfo: require('siteinfo.js'), // 注意此处不可删除
```
定义组合请求API
> 注意，未登录状态后端返回`-1`，请求错误返回`0`，请求成功返回`1`因此可在请求中直接判断

授权登录方法
```javascript
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
```

##### siteinfo文件调整
```javascript
var siteinfo = {
    "uniacid": "2",
    "acid": "3",
    "multiid": "0",
    "version": "1.0",
    "siteroot": "https://w7.axu9.com/app/index.php",
    "design_method": "3"
}
module.exports = siteinfo
```
需要注意的是：`uniacid`的参数值必须和后台对应，`siteroot`中的请求域名需要和后台对应

### 简单的组件使用示例
##### 加载动画示例
```html
<l-loading show="{{isLoading}}" full-screen="{{true}}" opacity="0.8" color="#3F75F3" type="change"></l-loading>
<l-loading show="{{reLoading}}" full-screen="{{true}}" bg-color="#ff000000" color="#3F75F3" type="change"></l-loading>
```
```javascript
isLoading: true,  //显示全屏带白色遮罩
reLoading: false, // 全屏透明遮罩
```
##### 配合封装的请求使用如下
```javascript
// 获取热门文章
    getArticle() {
        let _this = this;
        App._get('article/lists', {
            is_recommend: 1,
        }, res => {
            _this.setData({
                articleList: res.data.list.data
            })
        }, false, () => {
            _this.setData({
                isLoading: false, // 	请求完毕关闭加载动画
                reLoading: false,  // 	请求完毕关闭加载动画
            })
        });
    },
```
##### 触底加载动画示例
```html
<ajax-loading id='ajax_loading' loadingsrc='/images/loading.gif' color='#999'></ajax-loading>
```
```javascript
/**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.ajaxloading = this.selectComponent("#ajax_loading");
        if (this.data.current_page >= this.data.last_page) {
            this.ajaxloading.AjaxLoading(true);
            this.ajaxloading.AjaxNoresult(false);
            return false;
        }
        this.getGenerateLog(this.data.current_page + 1);  // 请求下一页
        this.ajaxloading.AjaxLoading(false);
    },
```
