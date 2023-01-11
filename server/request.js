import config from '../config';
import { navigateTo } from '../utils/navigate';

const request = async (
    {url = '/', data = {}, method = 'GET', isShowLoading = false, isHideFailTips = true, ...extra} = {}
  ) => {
    return new Promise(async (resolve, reject) => {
        if(isShowLoading){
            wx.showLoading()
        }
        wx.request({
            url: `${config.baseURL}${url}`,
            data: Object.assign(data, {
                openid: wx.getStorageSync('openid')
            }),
            method,
            ...extra,
            success(res) {
                const { status, msg, data } = res.data;
                if(`${status}` === '202'){
                    // 需要重新授权登录
                    navigateTo({
                        router: 'Login'
                    })
                } else if(`${status}` === '200'){
                    resolve({
                        success: true,
                        data
                    })
                } else {
                    if(isHideFailTips){
                        wx.showToast({
                            title: msg,
                            icon: 'none'
                        });
                    }
                    resolve({
                        success: false,
                        msg
                    });
                }
            },
            complete(){
                setTimeout(() => {
                    wx.hideLoading()
                }, 6000)
            }
        })
    })
}
export default request;
export {
  request
};