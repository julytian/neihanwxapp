var that;
var app = getApp();
var util = require('../../utils/util');
Page({
    data: {
        searchKeys: {
            "iid": 9234212697,
            "os_version": "10.3.1",
            "os_api": 18,
            "app_name": "joke_essay",
            "channel": "App Store",
            "device_platform": "iphone",
            "idfa": "C1A098F7-F4FD-4637-8ADD-C2E80284C0D8",
            "live_sdk_version": 174,
            "vid": "60557D26-38D4-44D4-AE1B-3B8573EA465C",
            "openudid": "06c3fa553c55ede174948ed86a46958580c7bde6",
            "device_type": "iPhone 6S",
            "version_code": "6.1.8",
            "ac": "WIFI",
            "screen_width": 750,
            "aid": 7,
            "count": 20,
            "device_id": 35453050449,
            "group_id": 0,
            "offset": 0,
            "sort": "hot",
            "tag": "joke"
        },
        item: [],
        groupid: null,
        topComments: [],
        recentComments: [],
        commentCount: 0,
        offset: 0,
        hasMore: false,
        isOver: false // 下拉加载是否返回没有数据了
    },
    onLoad: function(options) {
        // 生命周期函数--监听页面加载
        that = this;
        let searchKeys = Object.assign({}, that.data.searchKeys, { group_id: options.groupid });
        that.setData({
            searchKeys: searchKeys
        });
    },
    onReady: function() {
        that.setData({
            item: app.globalData.detail,
            commentCount: app.globalData.detail.group.comment_count,
            pageCount: Math.ceil(app.globalData.detail.group.comment_count / 20)
        });

        // 获取评论
        that.onFetchComments();
    },
    onFetchComments: function() {
        wx.request({
            url: 'https://is.snssdk.com/neihan/comments/',
            data: that.data.searchKeys,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {

                var recentComments = res.data.data.recent_comments;
                var topComments = res.data.data.top_comments;
                if (recentComments.length > 0) {
                    recentComments = recentComments.map((item) => {
                        item.create_time = util.formatTime(item.create_time);
                        return item;
                    });
                    let comments = that.data.recentComments.concat(recentComments);
                    that.setData({
                        recentComments: comments,
                        offset: comments.length + 15,
                        hasMore: false,
                        isOver: false
                    });
                } else {
                    that.setData({
                        hasMore: false,
                        isOver: true
                    })
                }
                if (topComments.length > 0) {
                    topComments = topComments.map((item) => {
                        item.create_time = util.formatTime(item.create_time);
                        return item;
                    });
                    let comments = that.data.topComments.concat(topComments);
                    that.setData({
                        topComments: comments
                    });
                }
            }
        })
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
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作
        // String7
    },

    // 视频出错
    onErrorHandle: function(ev) {
        console.log(ev)
    },
    onReachBottom: function() {
        if (that.data.pageCount > 1 && that.data.offset < that.data.commentCount + 15) {
            that.setData({
                searchKeys: Object.assign({}, that.data.searchKeys, { offset: that.data.offset }),
                hasMore: true
            });
            that.onFetchComments();
        }
    }
})