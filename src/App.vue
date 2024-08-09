<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch: ' + import.meta.env.MODE)
  console.log('Api Base URL: ' + import.meta.env.VITE_API_URL)
  console.log('ENC Padding: ' + import.meta.env.VITE_ENC_PADDING)
})

onShow(() => {
  console.debug('App Show')
})

onHide(() => {
  console.debug('App Hide')
})
</script>

<style lang="scss">
@import '@climblee/uv-ui/index.scss';

@tailwind base;
@tailwind components;
@tailwind utilities;
</style>