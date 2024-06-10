<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title text-red-300">{{ title }}</text>
    </view>
    <view class="w1 border-solid border-red-500">1</view>
    <view class="wf border-solid border-cyan-600 mt-[5px]">1-1</view>
    <view class="w2 mt-16 border-solid border-blue-600">2</view>
    <view class="w3 mt-14 border-solid border-purple-500">3</view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app';

  const title = ref('Hello')

  onLoad(() => {
    console.log("onLoad")
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
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }
</style>