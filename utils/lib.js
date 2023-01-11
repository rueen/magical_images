
export default {
    /**
     * 保存图片到系统相册 支持多图
     */
    saveImage(srcArr){
        return new Promise((resolve) => {
            wx.showLoading({
                title: '下载中...',
            })
            let fun = (num) => {
                let url = srcArr[num];
                wx.getImageInfo({
                    src: url,
                    success: (sres) => {
                        wx.saveImageToPhotosAlbum({
                            filePath: sres.path,
                            complete: (res) => {
                            num += 1;
                            if (num < srcArr.length) {
                                fun(num)
                            } else {
                                wx.hideLoading()
                                resolve()
                            }
                            }
                        })
                    },
                    fail: () => {
                        num += 1;
                        if (num < srcArr.length) {
                            fun(num)
                        } else {
                            wx.hideLoading()
                            this.toast('下载失败')
                        }
                    }
                })
            }

            fun(0)
        })
    },
}