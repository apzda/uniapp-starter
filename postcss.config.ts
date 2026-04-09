import { isMp } from './platform'
import postcssPxTransform from 'postcss-pxtransform'
import UnoCSS from '@unocss/postcss'

const plugins: any[] = [UnoCSS()]

// 下方为 px 转 rpx 功能, 根据你自己的需求打开它
if (isMp) {
  plugins.push(
    postcssPxTransform({
      platform: 'weapp',
      designWidth: 375,
      unitPrecision: 6,
      mediaQuery: false,
      replace: true,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
        375: 2
      }
    })
  )
}

export default plugins
