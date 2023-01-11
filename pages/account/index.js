// pages/account/index.js
const { globalData } = getApp();
import { navigateTo } from '../../utils/navigate';
import { usersServer } from '../../server/index';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
    data: {
        minHeight: 0,
        isLogin: !!wx.getStorageSync('openid'),
        userInfo: wx.getStorageSync('userInfo'),
        isEditNickname: false,
        leftTimes: wx.getStorageSync('leftTimes'),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMinHeight();
    },

    onShow() {
        this.refresh();
    },

    refresh(){
        const openid = wx.getStorageSync('openid');
        this.setData({
            isLogin: !!openid,
            leftTimes: wx.getStorageSync('leftTimes'),
        })
        if(!!openid){
            // 获取用户详情
            this.getUserInfo()
        }
    },

    getMinHeight(){
        const windowHeight = globalData.windowHeight;
        const navBarHeight = globalData.navBarHeight;
        this.setData({
            minHeight: windowHeight - 20 - navBarHeight
        })
    },
    async getUserInfo(){
        const { success, data } = await usersServer.detail();
        if(success){
            this.setData({
                userInfo: data || {}
            })
        }
    },
    login(){
        navigateTo({
            router: 'Login'
        })
    },
    async onChooseAvatar(e) {
        const { avatarUrl } = e.detail;
        const FormData = require('../../utils/formData');
        let formData = new FormData();
        formData.append('openid', wx.getStorageSync('openid'));
        formData.appendFile("avatar", avatarUrl);
        let params = formData.getData();
        // 修改头像
        this.editAvatar(params);
    },
    // 修改头像
    async editAvatar(params){
        const { success, msg } = await usersServer.editAvatar(params);
        if(success){
            this.getUserInfo();
        } else {
            wx.showToast({
              title: msg,
              icon: 'none'
            })
        }
    },
    // 编辑昵称
    handleEditNickname(){
        this.setData({
            isEditNickname: true
        })
    },
    nicknameOnBlur(e){
        const { detail: { value } } = e;
        
        if(value && value.trim()){
            // 修改昵称
            if(value.length > 20){
                wx.showModal({
                    title: '提示',
                    content: '昵称不可超过20个字',
                    success (res) {}
                })
            } else {
                this.editNickName(value.trim());
            }
        }
        this.setData({
            isEditNickname: false
        })
    },
    // 修改昵称
    async editNickName(nickname){
        const { success, msg } = await usersServer.profile({
            nick_name: nickname
        });
        if(success){
            this.getUserInfo();
        } else {
            wx.showToast({
              title: msg,
              icon: 'none'
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    async onShareAppMessage() {
        await app.addTimes();
        this.setData({
            leftTimes: wx.getStorageSync('leftTimes')
        })

        return {
            title: '分享标题',
            path: 'pages/index/index',
            imageUrl: ''
        }
    }
})