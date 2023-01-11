// index.js
import { styleServer, aigcServer } from '../../server/index';
const { globalData } = getApp();
import { navigateTo } from '../../utils/navigate';

Page({
    data: {
        minHeight: 0,
        tapType: 'ai',
        previewImgUrl: null, // 预览原图
        drawImgUrl: null, // 成品图
        isLoading: false,
        phoneNumber: '',
        isLogin: !!wx.getStorageSync('openid'),
        placeList: [],
        activePlace: null,
        styleList: [],
        activeStyle: null
    },
    onLoad(options) {
        this.getMinHeight();
        this.getPlace();
        this.getStyle();
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
            minHeight: windowHeight - 574/2 - navBarHeight
        })
    },
    async getPlace(){
        const { success, data, msg } = await aigcServer.get_place();
        if(success){
            this.setData({
                placeList: data || [],
                activePlace: data[0] || {}
            })
        } else {
            wx.showToast({
              title: msg,
              icon: 'none'
            })
        }
    },
    async getStyle(){
        const { success, data, msg } = await aigcServer.get_style();
        if(success){
            this.setData({
                styleList: data || [],
                activeStyle: data[0] || {}
            })
        } else {
            wx.showToast({
              title: msg,
              icon: 'none'
            })
        }
    },
    switchTap(e){
        const { currentTarget: { dataset: { type } } } = e;
        this.setData({
            tapType: type
        })
    },
    login(){
        navigateTo({
            router: 'Login'
        })
    },
    switchPlace(e){
        const { currentTarget: { dataset: { item } } } = e;
        this.setData({
            activePlace: item
        })
    },
    switchStyle(e){
        const { currentTarget: { dataset: { item } } } = e;
        this.setData({
            activeStyle: item
        })
    },
    uploadImage(){
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: (res) => {
                const tempFiles = res.tempFiles[0];
                this.setData({
                    previewImgUrl: tempFiles.tempFilePath
                })
            }
        })
    },
    async drawAi(){
        const { previewImgUrl, isLoading } = this.data;
        if(isLoading){
            return;
        }
        if(!previewImgUrl){
            wx.showModal({
                title: '提示',
                content: '请先上传素材',
                success (res) {}
            })              
            return;
        }
    },
    async drawComic(){
        const { previewImgUrl, isLoading } = this.data;
        if(isLoading){
            return;
        }
        if(!previewImgUrl){
            wx.showModal({
                title: '提示',
                content: '请先上传素材',
                success (res) {}
            })              
            return;
        }
        const FormData = require('../../utils/formData');
        let formData = new FormData();
        formData.append("openid", wx.getStorageSync('openid'));
        formData.appendFile("image", previewImgUrl);
        let params = formData.getData();
        this.setData({
            isLoading: true
        })
        const { success, data, msg } = await styleServer.gan(params);
        if(success){
            this.setData({
                drawImgUrl: data.img_url
            })
        } else {
            wx.showToast({
                title: msg,
                icon: 'none'
            })
        }
        this.setData({
            isLoading: false
        })
    },
    // AI一键作画
    draw(){
        const { tapType } = this.data;
        if(tapType === 'ai'){
            this.drawAi();
        } else if(tapType === 'comic'){
            this.drawComic();
        }
    }
})
