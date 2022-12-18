// index.js
Page({
  data: {
    tapType: 'ai',
    location: 'beach'
  },
  onLoad(options) {
    
  },
  switchTap(e){
    const { currentTarget: { dataset: { type } } } = e;
    this.setData({
      tapType: type
    })
  }
})
