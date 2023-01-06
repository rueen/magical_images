import config from '../config';
import { navigateTo } from '../utils/navigate';

const request = async (
    {url = '/', data = {}, method = 'GET', isShowLoading = false, isHideFailTips = true} = {}
  ) => {
    return new Promise(async (resolve, reject) => {
        if(isShowLoading){
            wx.showLoading()
        }
        wx.request({
            url: `${config.baseURL}${url}`,
            data,
            method,
            success(res) {
                const { status, msg, data } = res.data;
                if(`${status}` === '0014'){
                    // 需要重新授权登录
                    navigateTo({
                        router: 'Login'
                    })
                } else if(`${status}` === '200'){
                    resolve({
                        success: true,
                        data
                    })
                } else if(`${status}` === '0011') {
                    if(isHideFailTips){
                        wx.showToast({
                            title: msg,
                            icon: 'none'
                        });
                    }
                    reject({
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