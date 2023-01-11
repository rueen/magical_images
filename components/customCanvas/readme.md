设计稿 750  
elements: array
- text
```js
  type: 'text',
  content: '文本内容',
  maxLine: 2, // 最大行数 超出部分...
  color: '#000', // 文字颜色 默认 '#333'
  fontSize: 20, // 文字大小
  maxWidth: 600, // 最大宽度 超出换行
  x: 0, // 左起点
  y: 15, // 上起点 高度/2
  height: 30, // 高度
  fontFamily: 'sans-serif', // 文字Family
  bold: 'bold' // 是否加粗 支持 bold 或者数值
```
- image
```js
  type: 'image',
  src: 'http://seatent.com/img/fxpage/img-about.png',
  width: 200,
  height: 200,
  x: 0,
  y: 100,
  r: 50, // 半径 圆形时使用
  radius: 150 // 圆角角度
```
- arc
```js
  type: 'arc',
  x: 100,
  y: 100,
  r: 100, // 半径
  start: 0, // 起始弧度
  end: 2 * Math.PI, // 终止弧度
  fillStyle: 'green', // 填充颜色
  strokeStyle: 'red', // 线条颜色
  lineWidth: 2 // 线条宽度
```
- line
```js
type: 'line',
strokeStyle: '#999', // 线条颜色
lineWidth: 1, // 线条宽度
startX: 27 + priceLen*20 + 50,
startY: 659,
endX: 27 + priceLen*20 + 50 + (mktPriceLen-1) * 12 + 15,
endY: 659,
```
[{
  type: 'image',
  src: 'http://seatent.com/img/fxpage/img-about.png',
  width: 200,
  height: 200,
  x: 0,
  y: 100,
  r: 50, // 半径 圆形时使用
  radius: 150 // 圆角角度
},{
  type: 'text',
  ...
},
...]