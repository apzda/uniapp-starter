import { defineHandler } from '@/@types'

export default defineHandler({
  onLogin({ url }) {
  },
  onResetPassword({ url }) {
  },
  onRequestTooFast({ url }) {
    console.warn('request "' + url + '" is too fast')
  },
  onErr801(event) {
    event.suppress = true
    return true
  },
  onErr802(event) {
    event.suppress = true
    return true
  },
  onErr810(event) {
    event.suppress = true
    return true
  },
  onErr813(event) {
    event.suppress = true
    return true
  }
})
