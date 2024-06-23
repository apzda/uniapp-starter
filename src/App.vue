<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useAxios } from '@/utils/axios'

const axios = useAxios('default')

onLaunch(() => {
  console.log('App Launch: ' + import.meta.env.MODE)
  console.log('Api Base URL: ' + import.meta.env.VITE_API_URL)
  console.log('ENC Padding: ' + import.meta.env.VITE_ENC_PADDING)

  axios.get('captcha/create', {
    data: {
      width: 120
    }
  }).then(({ data }) => {
    console.log(data)
  }).catch((err) => {
    console.error('应用侧捕获到错误: ', err)
  }).finally(() => {
    console.log('App Launched successfully.')
  })
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