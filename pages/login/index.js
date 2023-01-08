// pages/login/index.js
import { usersServer } from '../../server/index';
import { navigateTo } from '../../utils/navigate';
import config from '../../config';

const app = getApp();
const globalData = app.globalData || {};
const safeArea = globalData.safeArea || {};

Page({
    /**
     * 页面的初始数据
     */
    data: {
        height: `${safeArea.height - globalData.navBarHeight}px`,
        isAgree: false,
        userInfo: null, // 存储微信用户信息
        phoneNumber: null, // 存储用户手机号
        protocolContent: '' // 注册协议内容
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    handleLogin(){
        this.modal = this.selectComponent("#modal");
        if(this.modal){
            this.modal.show();
        }
    },
    async checkboxChange(){
        const { isAgree } = this.data;
        
        this.setData({
            isAgree: !isAgree
        })
    },
    async getPhoneNumber (e) {
        const { code } = e.detail;
        const { success, data } = await usersServer.getPhoneNumber({
            code
        });
        if(success){
            this.setData({
                phoneNumber: data.phoneNumber
            }, () => {
                this.login();
            })
        }
    },
    login() {
        wx.login({
            success: async res => {
                const { success, data } = await usersServer.login({
                    code: res.code,
                    mobile: this.data.phoneNumber
                });
                if(success){
                    wx.showToast({
                        title: '登录成功',
                        icon: 'success'
                    })
                    wx.setStorageSync('token', data.token);
                    let rememberRouter = wx.getStorageSync('rememberRouter');
                    app.pages.get(rememberRouter) && app.pages.get(rememberRouter).refresh();
                    // 原路返回
                    wx.navigateBack();
                    wx.removeStorageSync('rememberRouter');
                }
            }
        });
    },    
})