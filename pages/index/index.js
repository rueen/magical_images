// index.js
import { styleServer, usersServer } from '../../server/index';
const { globalData } = getApp();

Page({
  data: {
    minHeight: 0,
    tapType: 'ai',
    location: 'beach',
    previewImgUrl: '../../image/demo.png',
    isLoading: false
  },
  onLoad(options) {
    this.getMinHeight()
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
  async getPhoneNumber(e){
    const { code } = e.detail;
    const { success, data } = await usersServer.getPhoneNumber({
      code
    });
    console.log(data)
    if(success){

    }
    // this.wxLogin();
  },
  wxLogin() {
    return new Promise((resolve) => {
      wx.login({
        success: res => {
          console.log('login', res)
          resolve(res.code);
        }
      });
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
