<template>
  <ConfigProvider :theme="app.theme">
    <slot />
  </ConfigProvider>
</template>
<script lang="ts" setup>
import ConfigProvider from './ConfigProvider.vue'
import { useAppStore } from '@/stores'

const { app, setupTheme } = useAppStore()
setupTheme()
</script>