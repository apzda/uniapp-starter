<template>
  <view class="content from-blue-500 bg-gradient-to-b to-95%">
    <image class="logo" :src="'/static/logo.png'" />
    <view class="text-area">
      <text class="title text-red-300">{{ title }}</text>
    </view>
    <view class="w1 border-solid border-red-500">1</view>
    <view class="wf border-solid border-cyan-600 mt-[50px]">1-1</view>
    <view class="w2 mt-16 border-solid border-blue-600">2</view>
    <view class="w3 mt-14 border-solid border-purple-500">3</view>

    <button v-if="isSuperAdmin()" class="w4 mt-16 border-solid border-purple-500" @click="onLogin">
      登录-{{ userInfo.uuid }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onHide, onLoad, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const { userInfo, isSuperAdmin } = useUserStore()

// 组件属性
// 组件事件
// 组件接口
// 组件引用
// 数据绑定
const title = ref('Hello')
// 内部函数
// 事件处理器
const onLogin = () => {
  uni.login({
    success(result) {
      console.log(result)
      userInfo.accessToken = result.code
      userInfo.uid = result.code
    }
  })
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
  width: 750px;
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

.b-red {
  border-color: red;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200px;
  width: 200px;
  margin: 200px auto 50px;
}

.text-area {
  display: flex;
  justify-content: center;
}
</style>