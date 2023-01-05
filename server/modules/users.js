import request from '../request';

const usersServer = {
  // 用户登录
  async login(data = {}){
    return await request({ url: `/users/login`, data, method: 'POST' });
  },
  // 获取手机号
  async getPhoneNumber(data = {}){
    return await request({ url: `/users/login`, data, method: 'GET' });
  },
}

export default usersServer;