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

export function getTask(params) {
  return request({
    url: 'http://127.0.0.1/lx/task.php?way=getter',
    method: 'get',
    params: params
  })
}

export function updateTask(updateTaskData) {
  return request({
    url: 'http://127.0.0.1/lx/task.php?way=update',
    method: 'post',
    data: {
      updateTaskData
    }
  })
}

export function addTaskConf(data) {
  return request({
    url: 'http://127.0.0.1/lx/task.php?way=setter&action=config',
    method: 'post',
    data: {
      data
    }
  })
}

export function addTaskForm(data) {
  return request({
    url: 'http://127.0.0.1/lx/task.php?way=setter&action=task',
    method: 'post',
    data: {
      data
    }
  })
}

export function addAssetsForm(data) {
  return request({
    url: 'http://127.0.0.1/lx/task.php?way=setter&action=assets',
    method: 'post',
    data: {
      data
    }
  })
}