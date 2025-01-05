import axios from 'axios'
import {getToken,removeToken,removeNickName } from '@/lib/auth'
import { toast } from '@/hooks/use-toast'



axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
console.log(axios.defaults.baseURL)
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'


axios.interceptors.request.use(config => {
  config.headers['Authorization'] = getToken()
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    toast({
        description: "服务端异常！",
      })
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.message) {
        toast({
            description: "res.data.message",
        })
    }
    // 登录已过期
    if (res.data.code == 'A0230') {
      // 移除 token 
      removeToken();
      removeNickName();
    }

    return Promise.reject(res.data)
  }

  return res.data
}, error => {
    toast({
        description: "服务端异常！",
    })
  console.log(error)
  Promise.reject(error)
})

export default axios