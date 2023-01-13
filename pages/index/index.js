// index.js
import { styleServer, aigcServer } from '../../server/index';
const { globalData } = getApp();
import { navigateTo } from '../../utils/navigate';
const app = getApp();

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
        activeStyle: null,
        leftTimes: wx.getStorageSync('leftTimes'),
    },
    onLoad(options) {
        this.getMinHeight();
        this.getPlace();
        this.getStyle();
    },
    onShow() {
        this.setData({
            isLogin: !!wx.getStorageSync('openid'),
            leftTimes: wx.getStorageSync('leftTimes')
        })
    },
    refresh(){
        this.setData({
            isLogin: !!wx.getStorageSync('openid'),
            leftTimes: wx.getStorageSync('leftTimes')
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
                // this.setData({
                //     previewImgUrl: tempFiles.tempFilePath
                // })
                wx.cropImage({
                    src: tempFiles.tempFilePath, // 图片路径
                    cropScale: '1:1', // 裁剪比例
                    success: (_res) => {
                        this.setData({
                            previewImgUrl: _res.tempFilePath
                        })
                    }
                })
            }
        })
    },
    async drawAi(){
        const { previewImgUrl, isLoading, activePlace, activeStyle } = this.data;
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
        formData.append("prompt_img2img", activeStyle.comment); // 风格
        formData.append("prompt_inpainting", activePlace.comment); // 地点
        formData.appendFile("img", previewImgUrl);
        let params = formData.getData();
        this.setData({
            isLoading: true
        })
        wx.showLoading({
            title: '绘制中...',
        })
        const { success, data, msg } = await aigcServer.model(params);
        if(success){
            navigateTo({
                router: 'WorksDetail',
                extras: {
                    id: data.id
                }
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
        wx.showLoading({
            title: '绘制中...',
        })
        const { success, data, msg } = await styleServer.gan(params);
        if(success){
            navigateTo({
                router: 'WorksDetail',
                extras: {
                    id: data.id
                }
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
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        app.addTimes();
        
        return {
            title: '分享标题',
            path: 'pages/index/index',
            imageUrl: ''
        }
    }
})
