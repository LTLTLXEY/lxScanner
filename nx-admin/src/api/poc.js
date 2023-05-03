import request from '@/utils/request'

export function getallpocs(params = 'selectAllPocs') {
  return request({
    url: 'http://127.0.0.1:8000/getallpocs/',
    method: 'get',
    params: params
  })
}

export function editpocs(data, action) {
  if (action == "del"){
    return request({
        url: 'http://127.0.0.1:8000/editpocs/?action=del',
        method: 'get',
        params: data
      })
  } else if (action == "upd" || action == "ins"){
    return request({
        url: 'http://127.0.0.1:8000/editpocs/?action='+action,
        method: 'post',
        data: {
          data
        }
      })
  }
}