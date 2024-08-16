<template>
  <app-page>
    <view>
      {{ ts('alert.help', 'Help!') }}
    </view>
  </app-page>
</template>
<script setup lang="ts">
import { ts } from '@/utils/i18n'
import AppPage from '@/components/AppPage.vue'
</script>