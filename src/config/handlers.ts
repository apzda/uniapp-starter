import { defineHandler } from '@/@types'
import type { CommonResponse, RequestOptions } from '@/@types/request'
import { useUserStore } from '@/stores/user'

export default defineHandler({
  beforeRequest(options: RequestOptions): RequestOptions {
    const { userInfo } = useUserStore()
    options.header = options.header || {}

    options.header.uuid = userInfo.uuid || ''

    if (!options.header['accept'] || !options.header['Accept']) {
      options.header['Accept'] = 'application/json'
    }

    if (options.method?.toLowerCase() == 'get') {
      options.data = {
        _t: new Date().getTime(),
        ...options.data
      }
    }

    return options
  },
  showTipMessage(success: boolean, type, message: string) {
    if (success) {
      console.info('成功提示: ' + message)
    } else {
      console.error('错误提示: ' + message)
    }
  },
  encrypt(data: any): string {
    throw new Error('encrypt not implemented')
  },
  decrypt(data: string): CommonResponse {
    throw new Error('decrypt not implemented')
  },
  onErr401(event) {
    event.suppress = true
    console.error('need login')
    return true
  },
  onErr810(event) {
    event.suppress = true
    return true
  }
})
