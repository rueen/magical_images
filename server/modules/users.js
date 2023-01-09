import request from '../request';

const usersServer = {
  // 用户登录
  async login(data = {}){
    return await request({ url: `/users/login/`, data, method: 'POST' });
  },
  // 获取手机号
  async getPhoneNumber(data = {}){
    return await request({ url: `/users/mobile/`, data, method: 'POST' });
  },
  // 修改用户信息
  async profile(data = {}){
    return await request({ url: `/users/profile/`, data, method: 'POST'});
  },
  // 修改用户头像
  async editAvatar(data = {}){
    return await request({ 
        url: `/users/profile/`,
        data: data.buffer,
        method: "POST",
        header: {
            'content-type': data.contentType,
        },
    });
  },
  // 获取用户信息
  async detail(data = {}){
    return await request({ url: `/users/detail/`, data, method: 'POST' });
  },
  // 获取注册协议
  async agreement(data = {}){
    return await request({ url: `/users/agreement/`, data });
  },
  // 获取隐私政策
  async privacy(data = {}){
    return await request({ url: `/users/privacy/`, data });
  }
}

export default usersServer;