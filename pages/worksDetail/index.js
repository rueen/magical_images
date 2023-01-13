// pages/worksDetail/index.js
const { globalData } = getApp();
import { usersServer } from '../../server/index';
import lib from "../../utils/lib";
const app = getApp();
import { switchTab } from '../../utils/navigate';
import config from '../../config';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        minHeight: 0,
        id: null,
        isShowCanvas: false,
        elements: [],
        poster: '', // 生成的海报图
        info: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMinHeight();
        const dataObj = JSON.parse(options.dataObj || '{}');
        if(dataObj.id != null){
            this.setData({
                id: dataObj.id
            }, () => {
                this.draw();
            });
        }
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
            this.getDetail()
        ]).then(res => {
            const elements = [...this.data.elements];
            const { info } = this.data;
            // 图片
            if(info.background){
                elements.push({
                    type: 'image',
                    src: info.background,
                    width: 620,
                    height: 620,
                    x: 20,
                    y: 20,
                    radius: 8
                })
            }
            // 二维码
            if(info.qr_code){
                elements.push({
                    type: 'image',
                    src: info.qr_code,
                    width: 140,
                    height: 140,
                    x: 20,
                    y: 660
                })
            }
            
            // 文案
            elements.push({
                type: 'text',
                content: '长按图片识别二维码和我一起体验AI作画',
                maxLine: 2, // 最大行数 超出部分...
                color: '#333', // 文字颜色 默认 '#333'
                fontSize: 24, // 文字大小
                maxWidth: 330, // 最大宽度
                height: 40,
                x: 220,
                y: 690
            })
            // 昵称
            if(info.nick_name){
                const len = info.nick_name.length;
                elements.push({
                    type: 'text',
                    content: `— ${info.nick_name}`,
                    maxLine: 1, // 最大行数 超出部分...
                    color: '#999', // 文字颜色 默认 '#333'
                    fontSize: 24, // 文字大小
                    maxWidth: 350, // 最大宽度
                    height: 30,
                    x: 600 - len * 15,
                    y: 780
                })
            }
            
            // 标签1
            let x1 = 480;
            let x2 = 480;
            let x3 = 480;
            if(info.model_type){
                elements.push({
                    type: 'image',
                    src: '../../image/tag_bg.png',
                    width: 140,
                    x: x1,
                    y: 560
                })
                elements.push({
                    type: 'text',
                    content: info.model_type,
                    maxLine: 1, // 最大行数 超出部分...
                    color: '#585FCC', // 文字颜色 默认 '#333'
                    fontSize: 24, // 文字大小
                    maxWidth: 176, // 最大宽度
                    height: 64,
                    textAlign: 'center',
                    x: x1 + 70,
                    y: 593
                })
                x2 = x1 - 150;
                x3 = x2;
            }
            // 标签2
            if(info.place){
                elements.push({
                    type: 'image',
                    src: '../../image/tag_bg.png',
                    width: 140,
                    x: x2,
                    y: 560
                })
                elements.push({
                    type: 'text',
                    content: info.place,
                    maxLine: 1, // 最大行数 超出部分...
                    color: '#585FCC', // 文字颜色 默认 '#333'
                    fontSize: 24, // 文字大小
                    maxWidth: 176, // 最大宽度
                    height: 64,
                    textAlign: 'center',
                    x: x2 + 70,
                    y: 593
                })
                x3 = x2 - 150;
            }
            // 标签3
            if(info.style){
                elements.push({
                    type: 'image',
                    src: '../../image/tag_bg.png',
                    width: 140,
                    x: x3,
                    y: 560
                })
                elements.push({
                    type: 'text',
                    content: info.style,
                    maxLine: 1, // 最大行数 超出部分...
                    color: '#585FCC', // 文字颜色 默认 '#333'
                    fontSize: 24, // 文字大小
                    maxWidth: 176, // 最大宽度
                    height: 64,
                    textAlign: 'center',
                    x: x3 + 70,
                    y: 593
                })
            }

            this.setData({
                elements,
                isShowCanvas: true
            })
            setTimeout(() => {
                wx.hideLoading()
            }, 1500);
        })
    },

    async getDetail(){
        const { id } = this.data;
        const { success, data, msg } = await usersServer.share_poster({
            check_path: 'true',
            id,
            env_version: config.env_version,
            "scene": "a=1",
            "page": "",
        });
        if(success){
            this.setData({
                info: data || {}
            })
        } else {
            wx.showToast({
              title: msg,
              icon: 'none'
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

    downloadOriginal(){
        const { info } = this.data;
        if(!info.background){
            wx.showToast({
                title: '原图加载中，请稍后',
                icon: 'none'
            })
            return;
        }
        lib.saveImage([info.background])
            .then(() => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            })
    },

    goHome(){
        switchTab('Index')
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