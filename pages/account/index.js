// pages/account/index.js
const { globalData } = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minHeight: 0,
    avatarUrl: '../../image/default_avatar.png',
    nickname: '微信用户',
    isEditNickname: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMinHeight();
  },

  getMinHeight(){
    const windowHeight = globalData.windowHeight;
    const navBarHeight = globalData.navBarHeight;
    this.setData({
      minHeight: windowHeight - 20 - navBarHeight
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl
    })
  },
  // 编辑昵称
  handleEditNickname(){
    this.setData({
      isEditNickname: true
    })
  },
  nicknameOnBlur(e){
    const { detail: { value } } = e;
    
    if(value.trim()){
      this.setData({
        nickname: value
      })
    }
    this.setData({
      isEditNickname: false
    })
  }
})