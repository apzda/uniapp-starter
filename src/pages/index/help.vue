<template>
  <theme-page>
    <view class="h-full">
      {{ ts('alert.help', 'Help!') }}
    </view>
  </theme-page>
</template>
<script setup lang="ts">
import { ts } from '@/utils/i18n'
import ThemePage from '@/components/ThemePage.vue'
</script>