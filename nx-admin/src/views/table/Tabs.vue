<template>
    <div class="app-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 任务列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`已完成(${read.length})`" name="first">
                    <template v-if="message === 'first'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column width="50">
                                <template slot-scope="scope" >
                                    <span>{{scope.row.TID}}</span>
                                </template>
                            </el-table-column>                            
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="150">
                                <template slot-scope="scope">
                                    <el-button size="small" type="normal" @click="handleDetial(scope.row.TID)">查看</el-button>
                                    <el-button size="small" type="danger" @click="handleDel(scope.row.TID)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`进行中(${unread.length})`" name="second">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <span>{{scope.row.TID}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.row.TID)">标为完成</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import {
  getTaskStatus,
  editTaskStatus
} from '@/api/task'

    export default {
      name: 'tabs',
      data() {
        return {
          message: 'first',
          showHeader: false,
          unread: [],
          read: []
        }
      },
      methods: {
        getStatus(){
            getTaskStatus().then(res => {
                for (let i = 0; i < res.status.length; i++) {
                    if (res.status[i].stat == 0){
                            this.read.push({
                            TID: res.status[i].TID,
                            title: res.status[i].name,
                            stat: res.status[i].stat,
                            date: res.status[i].time
                        })
                    }else{
                        this.unread.push({
                            TID: res.status[i].TID,
                            title: res.status[i].name,
                            stat: res.status[i].stat,
                            date: res.status[i].time
                        })
                    }
                }
                this.read.reverse()
                this.unread.reverse()
            }).catch((e) => {
                console.log(e)
            })
        },

        handleRead(index) {
          this.$confirm('确认标记已完成吗?', '标记', {})
            .then(() => {
              const para = {
                "action": "en",
                "tid": index
              }
              editTaskStatus(para).then(res => {
                    this.$message({
                    message: '标记成功',
                    type: 'success'
                    })
                    this.unread.splice(0, this.unread.length)
                    this.getStatus()
                }).catch(e => {
                console.log(e)
                })
            })
            .catch(e => {
              console.log(e)
            })
        },
        handleDel(index) {
            this.$confirm('确认删除吗?', '删除', {})
            .then(() => {
              const para = {
                "action": "un",
                "tid": index
              }
              editTaskStatus(para).then(res => {
                    this.$message({
                    message: '删除成功',
                    type: 'success'
                    })
                    this.read.splice(0, this.read.length)
                    this.getStatus()
                }).catch(e => {
                console.log(e)
                })
            })
            .catch(e => {
              console.log(e)
            })
        },
        handleDetial(index) {
            console.log(this.$router.push('/table/scanres?Tid='+index))
        }
      },
      computed: {
        unreadNum() {
          return this.unread.length
        }
      },
        mounted(){
            this.getStatus()
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

