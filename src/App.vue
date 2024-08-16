<script setup lang="ts">
import { onHide, onLaunch, onShow, onThemeChange } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores'

// hooks
const { app } = useAppStore()

// lifecycles
onLaunch(() => {
  console.debug('App Launch: ' + import.meta.env.MODE)
  console.debug('Api Base URL: ' + import.meta.env.VITE_API_URL)
  console.debug('ENC Padding: ' + import.meta.env.VITE_ENC_PADDING)
})

onShow(() => {
  uni.getSystemInfo({
    success(result) {
      console.debug('App Show', result)
    }
  })
})

onHide(() => {
  console.debug('App Hide')
})

onThemeChange(() => {
  uni.getSystemInfo({
    success(result) {
      app.theme = result.theme || 'dark'
    }
  })
})
</script>

<style lang="scss">
@import '@climblee/uv-ui/index.scss';

@tailwind base;
@tailwind components;
@tailwind utilities;
</style>