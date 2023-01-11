// pages/works/index.js
import { navigateTo } from '../../utils/navigate';
const { globalData } = getApp();
import { usersServer } from '../../server/index';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        minHeight: 0,
        isLogin: !!wx.getStorageSync('openid'),
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMinHeight();
        this.getList();
    },

    onShow() {
        this.setData({
            isLogin: !!wx.getStorageSync('openid')
        })
    },

    getMinHeight(){
        const windowHeight = globalData.windowHeight;
        const navBarHeight = globalData.navBarHeight;

        this.setData({
            minHeight: windowHeight - 20 - navBarHeight
        })
    },
    login(){
        navigateTo({
            router: 'Login'
        })
    },
    async getList(){
        const { success, data, msg } = await usersServer.opus();
        
        this.setData({
            list: data || []
        })
        if(success){
            this.setData({
                list: data || []
            })
        } else {
            wx.showToast({
              title: msg,
              icon: 'none'
            })
        }
    },
    openDetail(){
        navigateTo({
            router: 'WorksDetail'
        })
    },
})