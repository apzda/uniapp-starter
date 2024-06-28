import CryptoJS from 'crypto-js'

const opts = {
  iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_ENC_IV)
}

const alg = import.meta.env.VITE_ENC_ALG || 'aes' == 'aes' ? CryptoJS.AES : CryptoJS.DES
const key = import.meta.env.VITE_ENC_KEY

export function decrypt(text: string): string {
  return alg.decrypt(text, key, opts).toString(CryptoJS.enc.Utf8)
}

export function decryptObj<T = any>(text: string): T | null {
  const decrypted = decrypt(text)
  if (decrypted) {
    return JSON.parse(decrypted) as T
  }
  return null
}

export function encrypt(text: string): string {
  return alg.encrypt(text, key, opts).toString()
}

export function encryptObj(obj: any): string {
  return encrypt(JSON.stringify(obj))
}