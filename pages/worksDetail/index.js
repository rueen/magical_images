// pages/worksDetail/index.js
const { globalData } = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    minHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMinHeight()
  },

  getMinHeight(){
    const windowHeight = globalData.windowHeight;

    this.setData({
      minHeight: windowHeight - 10
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})