// app.js
import PM from '/utils/page.js';
let pages = new PM();

App({
    onLaunch() {
        this.pages = pages;
        this.getGlobalDataInfo();
    },
    globalData: {
        statusBarHeight: 0, // 状态栏高度
        windowHeight: 0, // 可使用窗口高度
        menuButtonInfo: {}, // 胶囊按钮信息
        navBarHeight: 0, // 导航条高度
        safeArea: {},
    },
    getGlobalDataInfo() {
        wx.getSystemInfo({
            success: res => {
            this.globalData.statusBarHeight = res.statusBarHeight;
            this.globalData.windowHeight = res.windowHeight;
            console.log(res)
            const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
            this.globalData.menuButtonInfo = menuButtonInfo;
            const topH = menuButtonInfo.top - res.statusBarHeight;
            this.globalData.navBarHeight = topH * 2 + menuButtonInfo.height;
            this.globalData.safeArea = res.safeArea;
            }, fail(err) {
            console.log(err);
            }
        })
    },
})
