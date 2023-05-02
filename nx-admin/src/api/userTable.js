import request from '@/utils/request'

export function getUserListPage(params) {
  // console.log(params.key)
  // if (params.key!=''){
  return request({
    url: 'http://127.0.0.1/lx/search.php',
    method: 'get',
    params: params
  })
  // }
  // return '1'
}
export function getTouches(params) {
  return request({
    // url: 'http://127.0.0.1/lx/touches.php',
    url: 'http://127.0.0.1:8000/touchs',
    method: 'get',
    params: params
  })
}
export function removeUser(params) {
  return request({
    url: '/user/remove',
    method: 'get',
    params: params
  })
}
export function batchRemoveUser(params) {
  return request({
    url: '/user/batchremove',
    method: 'get',
    params: params
  })
}
export function editUser(params) {
  return request({
    url: '/user/edit',
    method: 'get',
    params: params
  })
}
export function addUser(params) {
  return request({
    url: '/user/add',
    method: 'get',
    params: params
  })
}
export function addTouch(addJson) {
  return request({
    url: 'http://127.0.0.1/lx/api.php',
    method: 'post',
    data: {
      addJson
    }
  })
}
export function edittouch(editJson, action) {
  return request({
    url: 'http://127.0.0.1:8000/edittouch/?action='+action,
    method: 'post',
    data: {
      editJson
    }
  })
}
