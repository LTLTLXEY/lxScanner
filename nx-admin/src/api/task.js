import request from '@/utils/request'

export function getProxy(params = 0) {
  return request({
    url: 'http://127.0.0.1/lx/proxy.php',
    method: 'get',
    params: params
  })
}

export function addProxy(addProxyData) {
  return request({
    url: 'http://127.0.0.1/lx/proxy.php?func=3',
    method: 'post',
    data: {
      addProxyData
    }
  })
}

export function delProxyData(params) {
  return request({
    url: 'http://127.0.0.1/lx/proxy.php?func=2',
    method: 'get',
    params: params
  })
}