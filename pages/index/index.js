// index.js
import { styleServer } from '../../server/index';
const { globalData } = getApp();
import { navigateTo } from '../../utils/navigate';

Page({
    data: {
        minHeight: 0,
        tapType: 'ai',
        location: 'beach',
        previewImgUrl: '../../image/demo.png',
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
    // AI一键作画
    async draw(){
        this.isLoading = true;
        const { success } = await styleServer.gan({
            image: this.data.previewImgUrl
        });
        this.isLoading = false;
    }
})
