// index.js
import { styleServer } from '../../server/index';
const { globalData } = getApp();
import { navigateTo } from '../../utils/navigate';

Page({
    data: {
        minHeight: 0,
        tapType: 'ai',
        location: 'beach',
        previewImgUrl: null, // 预览原图
        drawImgUrl: null, // 成品图
        isLoading: false,
        phoneNumber: '',
        isLogin: !!wx.getStorageSync('token')
    },
    onLoad(options) {
        this.getMinHeight()
    },
    onShow() {
        this.setData({
            isLogin: !!wx.getStorageSync('token')
        })
    },
    getMinHeight(){
        const windowHeight = globalData.windowHeight;
        const navBarHeight = globalData.navBarHeight;
        this.setData({
            minHeight: windowHeight - 574/2 - navBarHeight
        })
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
