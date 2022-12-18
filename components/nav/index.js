// components/nav/index.js
const { globalData } = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,//类型
      value: '幻视魔图'//默认值
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: globalData.statusBarHeight,
    height: globalData.navBarHeight
  },

  lifetimes: {
    attached(){
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
