// import CryptoJS from "crypto-js";
import * as CryptoJS from "crypto-js"

// 使用类型断言从环境变量中获取密钥和初始化向量
const KEY = CryptoJS.enc.Utf8.parse(`${import.meta.env.VITE_ENCRYPT_KEY}` as string)
const IV = CryptoJS.enc.Utf8.parse(`${import.meta.env.VITE_ENCRYPT_IV}` as string)

/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word: string, keyStr?: string, ivStr?: string): string {
  let key = KEY
  let iv = IV
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
  }
  if (ivStr) {
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }
  const secs = CryptoJS.enc.Utf8.parse(word)
  const params = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  }
  const encrypted = CryptoJS.AES.encrypt(secs, key, params)
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 * @return {string}
 */
export function Decrypt(word: string, keyStr?: string, ivStr?: string): string {
  let key = KEY
  let iv = IV
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
  }
  if (ivStr) {
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  }
  const base64 = CryptoJS.enc.Base64.parse(word)
  const src = CryptoJS.enc.Base64.stringify(base64)
  const params = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  }
  const decrypt = CryptoJS.AES.decrypt(src, key, params)
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
