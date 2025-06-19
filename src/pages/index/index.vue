<template>
  <theme-page>
    <view class="content from-blue-500 dark:from-red-500 to-100% bg-gradient-to-b">
      <image class="logo" :src="'/static/logo.png'" />
      <view class="text-area">
        <text class="title text-red-300">{{ ts(title, 'Hello') }}</text>
      </view>
      <view class="w1 border-solid border-red-500">1</view>
      <view class="wf mt-[50px] border-solid border-cyan-600 text-center"
            @click="changeTheme">Theme: {{ theme.name }}
      </view>
      <view class="w2 mt-16 border-solid border-blue-600 text-center" @click="gotoHelpPage">
        {{ ts('alert.help', 'Help') }}
      </view>

      <view class="w3 mt-14 border-solid border-purple-500 -wx:border-red-600">
        {{ ts('alert.success', 'Success') }}
      </view>

      <button
        class="w4 mt-16 border-solid border-cyan-600 bg-cyan-500 dark:border-gray-900 dark:bg-gray-800 text-center"
        @click="onLogin">
        <view class="i-mdi-home text-3xl text-red-600" />
        登录
      </button>
    </view>
  </theme-page>
</template>

<script setup lang="ts">
import { onHide, onLoad, onShow } from '@dcloudio/uni-app'
import { useRouter } from 'uni-mini-router'
import CryptoJS from 'crypto-js'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores'
import { getLanguage, setLanguage, ts } from '@/utils/i18n'
import ThemePage from '@/components/ThemePage.vue'

// 状态管理
const { userInfo } = useUserStore()
const { theme } = useAppStore()
const router = useRouter()
// 组件属性
// 组件事件
// 组件接口
// 组件引用
// 数据绑定
const title = ref('hello')
// 内部函数
// 事件处理器
const changeTheme = () => {
  if (theme.name === 'dark') {
    theme.name = 'light'
  } else {
    theme.name = 'dark'
  }
}
const onLogin = () => {
  uni.login({
    success(result) {
      console.log(result)
      userInfo.accessToken = result.code
      userInfo.uid = result.code
    }
  })
  const lang = getLanguage()
  if (lang == 'zh-CN') {
    setLanguage('en')
  } else {
    setLanguage('zh-CN')
  }

  const opts = {
    iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENC_IV)
  }

  const AES = CryptoJS.AES

  const encoded = AES.encrypt('hello', import.meta.env.VITE_ENC_KEY, opts)
  console.log('encrypted', encoded.toString())
  console.log('decrypted', AES.decrypt(encoded.toString(), import.meta.env.VITE_ENC_KEY, opts).toString(CryptoJS.enc.Utf8))
}
const gotoHelpPage = () => {
  router.push('/pages/index/help')
}
// 生命周期
onLoad(() => {
  console.log('Page onLoad')
})
onShow(() => {
  console.log('Page onShow')
})
onMounted(() => {
  console.log('Page onMounted')
})
onHide(() => {
  console.log('Page onHide')
})
</script>

<style>
.wf {
  width: 100%;
  border-width: 1px;
}

.w1 {
  width: 100%;
  border-width: 1px;
}

.w2 {
  width: 150px;
  border-width: 1px;
}

.w3 {
  width: 375px;
  border-width: 1px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 12.5rem;
  width: 12.5rem;
  margin: 200px auto 50px;
}

.text-area {
  display: flex;
  justify-content: center;
}
</style>