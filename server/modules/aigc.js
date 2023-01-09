import request from '../request';

const aigcServer = {
  // 获取风格
  async get_style(data = {}){
    return await request({ url: `/aigc/get_style/`, data });
  },
  // 获取地点
  async get_place(data = {}){
    return await request({ url: `/aigc/get_place/`, data });
  },
}

export default aigcServer;