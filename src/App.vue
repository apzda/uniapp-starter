<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import type { CommonResponse } from '@/@types/request'
import { useAxios } from '@/utils/axios'

const axios = useAxios('default')

onLaunch(() => {
  console.log('App Launch: ' + import.meta.env.MODE)
  console.log('Api Base URL: ' + import.meta.env.VITE_API_URL)
  console.log('ENC Padding: ' + import.meta.env.VITE_ENC_PADDING)

  axios.post<CommonResponse<number>>('abc', {}).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.error(err)
  }).finally(() => {
    console.log('App Launched successfully.')
  })
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