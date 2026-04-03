<template>
  <view>
    <wd-tabs v-model="tab">
      <template v-for="item in 4" :key="item">
        <wd-tab :title="`标签${item}`">
          <view class="content">内容{{ item }}</view>
        </wd-tab>
      </template>
    </wd-tabs>
  </view>
</template>

<script setup lang="ts">
const tab = ref<number>(0)
</script>