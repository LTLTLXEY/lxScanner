import { param2Obj } from '@/utils'
// import { fetchData } from '@/axios/touch.js'


// let List = []
// const count = 60

// let dataList = []

// fetchData().then(data => {
//   dataList = data
// })
// // const aaa = fetchData()

// for (let i = 0; i < count; i++) {
//   //console.log(Mock.mock)
//   //console.log(11111)
//   List.push(dataList({
//     id: dataList.id,
//     name: dataList.name,
//     addr: dataList.addr,
//     'age|18-60': 1,
//     birth: dataList.birth,
//     sex: dataList.birth
//   }))
// }

//import { fetchData } from '@/axios/touch.js'

// let List = []

// async function getList(pageNum) {
//   const dataList = await fetchData(pageNum)
//   for (let i = 0; i < 15; i++) {
//     List.push({
//       tid: dataList[i].TID,
//       touchkey: dataList[i].touchKey,
//       touchvalue: dataList[i].touchValue,
//       feature: dataList[i].feature,
//       state: dataList[i].state
//     })
//   }
// }

// export { getList }

// getList()
//import { fetchData } from '@/axios/touch.js'

// let List = []

// fetchData().then(data => {
//   List.push(...JSON.parse(data))
// })


// for (let i = 0; i < count; i++) {
//   console.log(Mock.mock)
//   console.log(11111)
//   List.push(Mock.mock({
//     id: Mock.Random.guid(),
//     name: Mock.Random.cname(),
//     addr: Mock.mock('@county(true)'),
//     'age|18-60': 1,
//     birth: Mock.Random.date(),
//     sex: Mock.Random.integer(0, 1)
//   }))
// }

export default {
  getUserLis: config => {
    console.log(config.url)
    const { tid, page = 1, limit = 15 } = param2Obj(config.url)

    const mockList = List.filter(user => {
      if (tid && user.tid.indexOf(tid) === -1) return false
      return true
    })

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 0,
      data: {
        total: mockList.length,
        users: pageList
      }
    }
  },
  createUser: config => {
    const { tid, touchkey, touchvalue, feature, state} = param2Obj(config.url)
    List.push({
      tid: tid,
      touchkey: touchkey,
      touchvalue: touchvalue,
      feature: feature,
      state: state
    })
    return {
      code: 0,
      data: {
        message: '添加成功'
      }
    }
  },
  deleteUser: config => {
    const { id } = param2Obj(config.url)
    List = List.filter(u => u.id !== id)
    return {
      code: 0,
      data: {
        message: '删除成功'
      }
    }
  },
  batchremove: config => {
    let { ids } = param2Obj(config.url)
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    return {
      code: 0,
      data: {
        message: '批量删除成功'
      }
    }
  },
  updateUser: config => {
    const { tid, touchkey, touchvalue, feature, state} = param2Obj(config.url)
    List.some(u => {
      if (u.id === id) {
        u.tid = tid
        u.touchkey = touchkey
        u.touchvalue = touchvalue
        u.feature = feature
        u.state = state
        return true
      }
    })
    return {
      code: 0,
      data: {
        message: '编辑成功'
      }
    }
  }
}
