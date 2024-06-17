<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch:' + import.meta.env.MODE)
  console.log('Api Base URL:' + import.meta.env.VITE_API_URL)
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>