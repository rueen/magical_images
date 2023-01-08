// components/layout/index.js
const { globalData } = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        navbarHeight: globalData.navBarHeight
    },

    lifetimes: {
        attached(){
            this.setData({
                navbarHeight: globalData.navBarHeight
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
