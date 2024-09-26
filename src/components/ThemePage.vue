<template>
  <ConfigProvider :theme="theme.name">
    <slot />
  </ConfigProvider>
</template>
<script lang="ts" setup>
import ConfigProvider from './ConfigProvider.vue'
import { useAppStore } from '@/stores'

const { theme } = useAppStore()
</script>