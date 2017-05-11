var that;
var util = require('../../utils/util');
var app = getApp();
Page({
    data: {
        searchKeys: {
            essence: 1, // 固定值 1
            content_type: -101, // 从获取 content_type 中获取得到的 list_id 字段值。目前推荐的是-101，视频的是-104，段友秀的是-301，图片的是-103，段子的是-102
            iid: 9234212697, // 一个长度为10的纯数字字符串，用于标识用户唯一性
            os_version: "10.3.1", // 操作系统版本号，例如7.1.0
            os_api: 18, // 操作系统版本，例如20
            app_name: "joke_essay", // 固定值joke_essay
            channel: "App Store", // 下载渠道，可360、tencent等
            device_platform: "iphone", // 设备平台，android 或 ios
            idfa: "C1A098F7-F4FD-4637-8ADD-C2E80284C0D8", //
            live_sdk_version: 130,
            vid: "60557D26-38D4-44D4-AE1B-3B8573EA465C",
            openudid: "06c3fa553c55ede174948ed86a46958580c7bde6", // 一个长度为16的数字和小写字母混合字符串
            device_type: "iPhone 6S", // 设备型号，例如 hongmi
            version_code: "6.1.5",
            ac: "wifi", // 网络环境，可取值 wifi
            screen_width: "750", // 屏幕宽度，px为单位
            device_id: "35453050449",
            aid: 7, // 固定值7
            city: "广州",
            count: 30, // 返回数量
            double_col_mode: 0,
            latitude: 23.20186538475997, // 经度。可为空
            longitude: 113.3148468443627, // 纬度。可为空
            message_cursor: 0,
            mpic: 1
        },
        jokes: [], // 每一项
        tip: '', // 更新提示内容
        tipShow: false, // 是否显示更新提示
        scrollFlag: true, // 是否可以滚动加载
        refreshFlag: false, // 是否显示刷新
        scrollTopView: 'scrollTop', // 返回顶部锚点id
        loadMore: false, // 是否现在加载更多
    },
    onLoad: function(options) {
        that = this;
        wx.showToast({
            title: '内涵君在奋力加油...',
            icon: 'loading',
            duration: 10000
        })
    },
    onReady: function() {
        that.onFtechData(that.data.searchKeys);
    },
    // 获取数据
    onFtechData: function(bool) {
        wx.request({
            url: 'https://lf.snssdk.com/neihan/stream/mix/v1/', //仅为示例，并非真实的接口地址
            data: that.data.searchKeys,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                wx.hideToast();
                let data = res.data.data;
                that.setData({
                    scrollFlag: true,
                    refreshFlag: false,
                    tipShow: false,
                    loadMore: true
                });
                if (data) {
                    let results = data.data.filter((item) => !item.ad);
                    let jokesNew = results.map((item) => {
                        // 视频
                        if (item.group && item.group.is_video && item.group.is_video == 1) {
                            item.group.videoCover = item.group.medium_cover.url_list["0"].url;
                            item.group.duration = util.formatSeconds(item.group.duration);
                        }
                        // gif
                        if (item.group && item.group.is_gif && item.group.is_gif == 1 && item.group.gifvideo) {
                            item.group.gifVideoCoverM = item.group.middle_image.url_list["0"].url ? item.group.middle_image.url_list["0"].url : 'http://p3.pstatp.com/w213/1cd10002c1f11c7bc57c';
                            item.group.gifVideoCoverL = item.group.large_image.url_list["0"].url ? item.group.large_image.url_list["0"].url : 'http://p3.pstatp.com/w213/1cd10002c1f11c7bc57c';
                        }
                        // 单张图片
                        if (item.group && item.group.media_type && item.group.media_type == 1) {
                            item.group.previewOne = item.group.middle_image.url_list["0"].url
                        }
                        return item;
                    });
                    if (bool) {
                        that.setData({
                            tip: data.tip,
                            jokes: that.data.jokes.concat(jokesNew)
                        });
                    } else {
                        that.setData({
                            tip: data.tip,
                            jokes: jokesNew
                        });
                    }
                } else {
                    that.setData({
                        refreshFlag: true
                    });
                    // 没有数据重新加载
                    setTimeout(() => {
                        bool ? that.onFtechData(true) : that.onFtechData();
                    }, 2000);
                }
            },
            fail: function(err) {
                console.log(err)
            }
        });
    },
    // 预览图片
    onPreviewImage: function(ev) {
        let current = ev.currentTarget.dataset.current;
        let urls = ev.currentTarget.dataset.urls;
        // 多张图
        if (typeof urls == 'object') {
            let arr = [];
            urls.map((item) => {
                arr.push(item.url);
            });
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: arr // 需要预览的图片http链接列表
            });
        } else { // 一张图
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: [urls] // 需要预览的图片http链接列表
            });
        }

    },
    // 切换tab,切换内容
    onSwitchTap: function(ev) {
        let type = ev.currentTarget.dataset.type;
        that.setData({
            searchKeys: Object.assign({}, that.data.searchKeys, { content_type: type }),
            jokes: [],
            loadMore: true
        });
        that.onFtechData(true);
    },
    // 段友秀
    onFriendShow: function(ev) {
        let type = ev.currentTarget.dataset.type;
        that.setData({
            searchKeys: Object.assign({}, that.data.searchKeys, { content_type: type }),
            jokes: [],
            loadMore: true
        });
        that.onFtechData(true);
    },
    // 滚动加载数据
    onScrollToLower: function(ev) {
        if (that.data.scrollFlag) {
            that.setData({
                scrollFlag: false,
                refreshFlag: true
            });
            that.onFtechData(true);
        }
    },
    // 返回顶部并刷新
    onGoTopAndRefresh: function(ev) {
        that.setData({
            scrollTopView: 'scrollTop',
            refreshFlag: true,
            tipShow: true
        });
        that.onFtechData();
    },
    // 远程图片加载404显示默认图
    onImageError: function(ev) {
        var _that = this;
        util.errImgFun(ev, _that);
    },
    // 跳到详情页
    onGoDetail: function(ev) {
        let detail = ev.currentTarget.dataset.detail;
        app.setGlobalData({
            detail: detail
        });
        let groupid = detail.group.group_id;
        wx.navigateTo({
            url: '../detail/detail?groupid=' + groupid
        });
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
            title: '内涵段子,以内涵会友',
            path: '/page/index/index'
        }
    }
})