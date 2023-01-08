import request from '../request';

const styleServer = {
  // 人物动漫生成(含人脸)
  async gan(data = {}){
    return await request({ url: `/style/gan/`, data, method: 'POST' });
  },
}

export default styleServer;