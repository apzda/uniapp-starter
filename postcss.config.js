/* eslint-disable @typescript-eslint/no-var-requires */
const {
  WeappTailwindcssDisabled
} = require('./platform')

/**
 * @type {import('postcss').AcceptedPlugin[]}
 */
const plugins = [require('tailwindcss')(), require('autoprefixer')()]

// 下方为 px 转 rpx 功能, 根据你自己的需求打开它
if (!WeappTailwindcssDisabled) {
  plugins.push(
    require('postcss-pxtransform')({
      platform: 'weapp',
      designWidth: 750,
      unitPrecision: 6,
      replace: true,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1, // 此时应用到的规则，代表 1px = 1rpx
        828: 1.81 / 2,
        375: 2 / 1
      }
    })
  )
}

plugins.push(require('weapp-tailwindcss/css-macro/postcss'))

module.exports = plugins