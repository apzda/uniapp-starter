import { defineHandler } from '@/@types'
import type { CommonResponse, RequestOptions } from '@/@types/request'

export default defineHandler({
  beforeRequest(options: RequestOptions): RequestOptions {
    options.header = options.header || {}

    // options.header.uuid = uuid_v4()

    if (!options.header['accept'] || !options.header['Accept']) {
      options.header['Accept'] = 'application/json'
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
