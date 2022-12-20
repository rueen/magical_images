import request from '../request';

const usersServer = {
  // 用户登录
  async login(data = {}){
    return await request({ url: `/users/login`, data, method: 'POST' });
  },
}

export default usersServer;