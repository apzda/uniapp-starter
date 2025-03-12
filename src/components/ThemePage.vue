<template>
  <view class="antialiased min-h-screen transition-colors duration-500 dark:text-white dark:bg-gray-800">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>