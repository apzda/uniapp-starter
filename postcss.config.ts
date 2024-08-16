import { WeappTailwindcssDisabled } from './platform'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssPxTransform from 'postcss-pxtransform'
import cssMacro from 'weapp-tailwindcss/css-macro/postcss'

const plugins: any[] = [tailwindcss(), autoprefixer()]

// 下方为 px 转 rpx 功能, 根据你自己的需求打开它
if (!WeappTailwindcssDisabled) {
  plugins.push(postcssPxTransform({
    platform: 'weapp',
    designWidth: 750,
    unitPrecision: 6,
    mediaQuery: true,
    replace: true,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1, // 此时应用到的规则，代表 1px = 1rpx
      828: 1.81 / 2,
      375: 2
    }
  }))
}
// 与tailwind.config.ts中的cssMacro一起使用时才有效
plugins.push(cssMacro)

export default plugins