// pages/works/index.js
import { navigateTo } from '../../utils/navigate';
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
    const navBarHeight = globalData.navBarHeight;

    this.setData({
      minHeight: windowHeight - 20 - navBarHeight
    })
  },

  openDetail(){
    navigateTo({
      router: 'WorksDetail'
    })
  }
})