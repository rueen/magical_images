// pages/worksDetail/index.js
const { globalData } = getApp();
import { usersServer } from '../../server/index';
import lib from "../../utils/lib";
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        minHeight: 0,
        isShowCanvas: false,
        elements: [],
        poster: '', // 生成的海报图
        userInfo: wx.getStorageSync('userInfo'),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMinHeight();
        this.draw();
    },

    getMinHeight(){
        const windowHeight = globalData.windowHeight;

        this.setData({
            minHeight: windowHeight - 10
        })
    },

    draw(){
        wx.showLoading({
            title: '绘制中...',
        })
        Promise.all([
            this.getUserInfo()
        ]).then(res => {
            const elements = [...this.data.elements];
            const { userInfo } = this.data;
            // 图片
            elements.push({
                type: 'image',
                src: 'https://wenxin.baidu.com/younger/file/selected/C2A618A863EDA3255B8F05D822176F55',
                width: 620,
                height: 680,
                x: 20,
                y: 20,
                radius: 8
            })
            // 二维码
            elements.push({
                type: 'image',
                src: 'https://mmbiz.qpic.cn/mmbiz_jpg/cVgP5bCElFhNSicyHulVLuDYQFPZLsIAx9DEg1jNJQ36ATINgqMDpicO1HNAwffYIMC8RkOXXk02uw3H5JY9bbGQ/0?wx_fmt=jpeg',
                width: 140,
                height: 140,
                x: 20,
                y: 720
            })
            // 文案
            elements.push({
                type: 'text',
                content: '长按图片识别二维码和我一起体验AI作画',
                maxLine: 2, // 最大行数 超出部分...
                color: '#333', // 文字颜色 默认 '#333'
                fontSize: 24, // 文字大小
                maxWidth: 350, // 最大宽度
                height: 40,
                x: 180,
                y: 745
            })
            // 昵称
            const len = userInfo.nick_name.length;
            elements.push({
                type: 'text',
                content: `— ${userInfo.nick_name}`,
                maxLine: 1, // 最大行数 超出部分...
                color: '#999', // 文字颜色 默认 '#333'
                fontSize: 24, // 文字大小
                maxWidth: 350, // 最大宽度
                height: 30,
                x: 600 - len * 15,
                y: 840
            })
            // 标签1
            elements.push({
                type: 'image',
                src: '../../image/tag_bg.png',
                width: 140,
                x: 480,
                y: 620
            })
            elements.push({
                type: 'text',
                content: '动漫人像',
                maxLine: 1, // 最大行数 超出部分...
                color: '#585FCC', // 文字颜色 默认 '#333'
                fontSize: 24, // 文字大小
                maxWidth: 176, // 最大宽度
                height: 64,
                textAlign: 'center',
                x: 550,
                y: 653
            })
            // 标签2
            elements.push({
                type: 'image',
                src: '../../image/tag_bg.png',
                width: 140,
                x: 330,
                y: 620
            })
            elements.push({
                type: 'text',
                content: '动漫风',
                maxLine: 1, // 最大行数 超出部分...
                color: '#585FCC', // 文字颜色 默认 '#333'
                fontSize: 24, // 文字大小
                maxWidth: 176, // 最大宽度
                height: 64,
                textAlign: 'center',
                x: 400,
                y: 653
            })
            // 标签3
            elements.push({
                type: 'image',
                src: '../../image/tag_bg.png',
                width: 140,
                x: 180,
                y: 620
            })
            elements.push({
                type: 'text',
                content: '海滩',
                maxLine: 1, // 最大行数 超出部分...
                color: '#585FCC', // 文字颜色 默认 '#333'
                fontSize: 24, // 文字大小
                maxWidth: 176, // 最大宽度
                height: 64,
                textAlign: 'center',
                x: 250,
                y: 653
            })

            this.setData({
                elements,
                isShowCanvas: true
            })
            setTimeout(() => {
                wx.hideLoading()
            }, 1500);
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

    onCreated(e){
        const { detail: { src } } = e;
        this.setData({
            poster: src
        })
    },

    // 下载海报
    downloadPoster(){
        const { poster } = this.data;
        if(!poster){
            wx.showToast({
                title: '海报生成中，请稍后',
                icon: 'none'
            })
            return;
        }
        lib.saveImage([poster])
            .then(() => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            })
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