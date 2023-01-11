
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    background: {
      type: String,
      value: '#ffffff'
    },
    width: String,
    height: String,
    scale: {
      type: Number,
      value: 1
    },
    elements: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  lifetimes: {
    attached: function() {
      this.onCanvas();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    rate(rpx) {
      const rate = 750.0 / wx.getSystemInfoSync().windowWidth;
      return (rpx / rate) * this.data.scale;
    },
    drawLine(options = {}){
      const startX = this.rate(options.startX);
      const startY = this.rate(options.startY);
      const endX = this.rate(options.endX);
      const endY = this.rate(options.endY);
      const { ctx, lineWidth, strokeStyle } = options;
      ctx.beginPath()
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    },
    drawArc(options = {}){
      const x = this.rate(options.x);
      const y = this.rate(options.y);
      const r = this.rate(options.r);
      const lineWidth = this.rate(options.lineWidth);
      const start = options.start || 0; // 起始弧度
      const end = options.end || 2 * Math.PI; // 终止弧度
      const { ctx, fillStyle, strokeStyle } = options;

      if(fillStyle){
        ctx.arc(x, y, r, start, end);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if(strokeStyle){
        ctx.beginPath()
        ctx.arc(x, y, r, start, end);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke()
      }
    },
    async drawImage(options = {}){
      const { ctx, image, sx, sy, sWidth, sHeight } = options;
      const x = this.rate(options.x);
      const y = this.rate(options.y); // 半径，圆形时使用
      const radius = this.rate(options.radius); // 圆角大小
      const r = this.rate(options.r);
      let scale = 1;
      if(!options.width || !options.height){
        // 如果不设置宽或者高 图片等比例缩放
        scale = (options.width/image.width) || (options.height/image.height)
      }
      const width = this.rate(options.width || image.width * scale);
      const height = this.rate(options.height || image.height * scale);
      ctx.save()
      if(r || radius){
        ctx.beginPath();
      }
      if(r){
        ctx.arc(x + width/2, y + height/2, r, 0, 2 * Math.PI);
      }
      if(radius){
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI*1.5)
        ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
        ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
        ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)
      }
      if(r || radius){
        ctx.clip();
      }
      if(sx != null || sy != null || sWidth != null || sHeight != null){
        let _sx = sx || 0;
        let _sy = sy || 0;
        let _sWidth = sWidth || image.width;
        let _sHeight = sHeight || image.height;
        ctx.drawImage(image, _sx, _sy, _sWidth, _sHeight, x, y, width, height)
      } else {
        ctx.drawImage(image, x, y, width, height)
      }
      ctx.restore()
    },
    drawText(options = {}){
      const { ctx, content, maxLine, color, textAlign, bold, fontFamily } = options;
      const defaultColor = '#333';
      const fontSize = this.rate(options.fontSize) || this.rate(20);
      const _x = this.rate(options.x);
      const _y = this.rate(options.y);
      const maxWidth = this.rate(options.maxWidth);

      // 获取总行数
      var startStr = content.slice(0);
      var allRow = Math.ceil(ctx.measureText(startStr).width / maxWidth);

      // 限制行数
      var count = allRow >= maxLine ? maxLine : allRow,
      // 当前字符串的截断点
      endPos = 0;
      // 设置文字颜色
      ctx.fillStyle = color || defaultColor;
      // 设置字体大小
      ctx.font = `${bold ? bold : ''} ${fontSize}px ${fontFamily}`;
      // 设置字体对齐
      ctx.textAlign = textAlign || 'left';
      // 循环截断
      for (var j = 0; j < count; j++) {
        if(j > 0 && endPos === 0){
          break;
        }
        // 当前剩余的字符串
        var nowStr = content.slice(endPos),
        // 每一行当前宽度
        rowWid = 0,
        // 每一行顶部距离
        y = _y + (count == 1 ? 0 : j * this.rate(options.height));
        // 如果当前的字符串宽度大于最大宽度，然后开始截取
        if (ctx.measureText(nowStr).width > maxWidth) {
          for (var m = 0; m < nowStr.length; m++) {
            // 计算当前字符串总宽度
            rowWid += ctx.measureText(nowStr[m]).width;
            if (rowWid > maxWidth) {
              // 如果是最后一行
              if (j === maxLine - 1) {
                ctx.fillText(nowStr.slice(0, m - 1) + '...', _x, y);
              } else {
                ctx.fillText(nowStr.slice(0, m), _x, y);
              }
              // 保留下次截断点
              endPos += m;
              break;
            }
          }
        } else { // 如果当前的字符串宽度小于最大宽度就直接输出
          ctx.fillText(nowStr.slice(0, m), _x, y);
        }
      }
    },
    onCanvas(){
      const query = this.createSelectorQuery();
      query.select('#canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          const dpr = wx.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          this.draw(canvas, ctx, dpr);
        })
    },
    async draw(canvas, ctx, dpr){
      const { background, elements } = this.data;
      // 绘制前清空canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = background;
      ctx.fillRect(0,0,canvas.width, canvas.height);
      let elementPromise = [];
      elements.forEach((element, index) => {
        if(element.type === 'image'){
          let fn = (() => {
            return new Promise(async (resolve) => {
              const image = canvas.createImage();
              image.src = element.src;
              image.onload = () => {
                element.image = image;
                elements.splice(index, 1, element)
                resolve();
              }
            })
          })
          elementPromise.push(fn());
        }
      })
      
      Promise.all(elementPromise).then(() => {
        elements.forEach((element) => {
          if(element.type === 'text'){
            this.drawText({
              ctx,
              ...element
            })
          }
          if(element.type === 'image'){
            this.drawImage({
              canvas,
              ctx,
              ...element
            })
          }
          if(element.type === 'arc'){
            // 画圈
            this.drawArc({
              ctx,
              ...element
            });
          }
          if(element.type === 'line'){
            // 线
            this.drawLine({
              ctx,
              ...element
            })
          }
        })
        // wx.hideLoading()
        wx.canvasToTempFilePath({
          //把当前画布指定区域的内容导出生成指定大小的图片
          canvas: canvas, // canvas实例
          success: (res) => {
            this.triggerEvent('onCreated',{
              src: res.tempFilePath
            });
          }
        })
      })
    }
  }
})
