<template>
    <div class="app-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-order"></i> 扫描 </el-breadcrumb-item>
                <el-breadcrumb-item>方案配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="85px">
                    <el-form-item label="选择方案">
                        <el-select v-model="form.taskPick" placeholder="空方案" @change="getTaskDetil($event)">
                            <el-option v-for="(item, index) in savedTask" :key="index" :label="item.task_scheme_name" :value="index"></el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-form-item label="方案名称">
                        <el-input v-model="form.task_scheme_name"></el-input>
                    </el-form-item>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="最大线程">
                          <div style="display: flex; align-items: center;">
                            <el-input-number v-model="form.task_max_thread"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="扫描器最大线程数(个)"></i>
                            </div>
                          </div>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="超时设置">
                          <div style="display: flex; align-items: center;">
                            <el-input-number v-model="form.task_timeout"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="请求最大超时时长(S)"></i>
                            </div>
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="递归深度">
                          <div style="display: flex; align-items: center;">                          
                            <el-input-number v-model="form.task_recursion_depth"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="页面爬取递归深度(页)"></i>
                            </div>
                          </div>                            
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="重试次数">
                          <div style="display: flex; align-items: center;">                          
                            <el-input-number v-model="form.task_retry_times"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="请求重试次数(次)"></i>
                            </div>
                          </div>                            
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="响应大小">
                          <div style="display: flex; align-items: center;">                          
                            <el-input-number v-model="form.task_response_size"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="响应包最大长度(Mb)"></i>
                            </div>
                          </div>                            
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="请求速度">
                          <div style="display: flex; align-items: center;">                          
                            <el-input-number v-model="form.task_request_speed"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="每秒最大请求次数(次)"></i>
                            </div>
                          </div>                            
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="渲染等待">
                          <div style="display: flex; align-items: center;">                          
                            <el-input-number v-model="form.task_draw_wait"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="页面解析渲染等待时长(S)"></i>
                            </div>
                          </div>                            
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">                        
                        <el-form-item label="请求队列">
                          <div style="display: flex; align-items: center;">                          
                            <el-input-number v-model="form.task_request_queue"></el-input-number>
                            <div style="font-size:20px;">
                              <i class="el-icon-odometer" style="margin-left: 10px;" title="队列长度限制,最大允许等待扫描的请求数(个)"></i>
                            </div>
                          </div>                            
                        </el-form-item>
                    </el-col>
                    </el-row>                    
                    <el-form-item label="请求方法">
                    <el-checkbox-group size="small" v-model="checkedMethod">
                        <el-checkbox style="width: 93px;margin-right: 1px;" border v-for="item in selectedMethodsForm1" :disabled="item === 'GET' || item === 'POST'" :key="item" :checked="item === 'GET' || item === 'POST'" :label="item">{{item}}</el-checkbox>
                      </el-checkbox-group>
                      <el-checkbox-group size="small" v-model="checkedMethod" style="margin-top: 4px;">
                        <el-checkbox style="width: 93px;margin-right: 1px;" border v-for="item in selectedMethodsForm2" :key="item" :label="item">{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="UserAgent">
                        <el-input v-model="form.task_user_agent" type="textarea" ref="uaRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="主机白名单">
                        <el-input v-model="form.task_host_white_list" type="textarea" ref="whostRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="主机黑名单">
                        <el-input v-model="form.task_host_black_list" type="textarea" ref="bhostRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="端口白名单">
                        <el-input v-model="form.task_port_white_list" type="textarea" ref="wportRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="端口黑名单">
                        <el-input v-model="form.task_port_black_list" type="textarea" ref="bportRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="IP白名单">
                        <el-input v-model="form.task_ip_white_list" type="textarea" ref="wipRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="IP黑名单">
                        <el-input v-model="form.task_ip_black_list" type="textarea" ref="bipRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">方案提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { getTask,addProxy,delProxyData,updateTask,addTaskConf } from '@/api/task.js'
const checkedMethod1 = ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'];
const checkedMethod2 = ['OPTIONS', 'CONNECT', 'TRACE', 'MOVE', 'PROPFIND', 'COPY']
    export default {
      name: 'taskForm',
      data: function() {
        return {
            form: {
                SID: '',
                task_scheme_name: '',
                task_max_thread: '',
                task_timeout: '',
                task_recursion_depth: '',
                task_retry_times: '',
                task_response_size: '',
                task_request_speed: '',
                task_request_method: '',
                task_request_queue: '',
                task_user_agent: '',
                task_host_white_list: '',
                task_host_black_list: '',
                task_port_white_list: '',
                task_port_black_list: '',
                task_draw_wait:'',
                task_ip_white_list: '',
                task_ip_black_list: ''
            },
          selectedMethodsForm1: checkedMethod1,
          selectedMethodsForm2: checkedMethod2,
          checkedMethod: [], // 存储已选中的请求方式
          savedTask: [] //已有的配置
        }
      },
      methods: {
        onSubmit() {
          //console.log(this.form);
          //this.$message.success('提交成功！')
          this.updateTaskData(this.form.SID);
        },
        getTaskData:function(){
          getTask().then(res => {
            for (let i = 0; i < res.length; i++){
              this.savedTask.push({
                SID: res[i].SID,
                task_scheme_name: res[i].task_scheme_name,
                task_max_thread: res[i].task_max_thread,
                task_timeout: res[i].task_timeout,
                task_recursion_depth: res[i].task_recursion_depth,
                task_retry_times: res[i].task_retry_times,
                task_response_size: res[i].task_response_size,
                task_request_speed: res[i].task_request_speed,
                task_request_method: res[i].task_request_method,
                task_request_queue: res[i].task_request_queue,
                task_draw_wait: res[i].task_draw_wait,
                task_user_agent: res[i].task_user_agent.split("|&|").join("\n"),
                task_host_white_list: res[i].task_host_white_list,
                task_host_black_list: res[i].task_host_black_list,
                task_port_white_list: res[i].task_port_white_list,
                task_port_black_list: res[i].task_port_black_list,
                task_ip_white_list: res[i].task_ip_white_list,
                task_ip_black_list: res[i].task_ip_black_list
              })
            }
          }).catch((e) => {
              console.log(e)
            })
        },
        compJson(jsonStr1, jsonStr2) {
          const obj1 = JSON.parse(jsonStr1);
          const obj2 = JSON.parse(jsonStr2);
          const keys1 = Object.keys(obj1);
          const keys2 = Object.keys(obj2);
          if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
            return false;
          }
          for (const key of keys1) {
            const value1 = obj1[key];
            const value2 = obj2[key];
            if (value1 !== value2 && `${value1}` !== `${value2}`) {
              return false;
            }
          }
          return true;
        },
        updateTaskData(SID){
          this.$refs.form.validate(valid => {
            if (valid) {
              this.$confirm('确认提交吗?', '提示', {})
                .then(() => {
                  if(SID!=''){
                    const para = Object.assign({}, this.form)
                    // 查看是否有更改
                    para['task_request_method'] = this.formatMethod(this.checkedMethod.join(',')).split("").sort().join("");
                    delete para['taskPick'];
                    if(!this.compJson(JSON.stringify(para),JSON.stringify(this.savedTask[SID-1]))){
                      //update UA插入换行符
                      para['task_user_agent'] = para['task_user_agent'].split("\n").join("|&|");
                      updateTask(JSON.stringify(para)).then(res => {
                      }).catch(e => {
                        console.log(e)
                    })
                    this.$message({
                          message: '修改成功',
                          type: 'success'
                      })
                    }
                  }else{
                    //新增数据
                    const paraNew = Object.assign({}, this.form)
                    paraNew['task_request_method'] = this.formatMethod(this.checkedMethod.join(',')).split("").sort().join("");
                    paraNew['task_user_agent'] = paraNew['task_user_agent'].split("\n").join("|&|");
                    addTaskConf(JSON.stringify(paraNew)).then(res => {
                      this.$message({
                          message: '新增成功',
                          type: 'success'
                      })
                    }).catch(e => {
                      console.log(e);
                    })
                  }
                })
                .catch(e => {
                  // 打印一下错误
                  console.log(e)
                })
            }
          })
        },
        handleAddProxy() {
          this.addForm = {
            proxyName: '',
            proxyProtocol: 0,
            proxyAddress: '',
            proxyPort: '',
            proxyUsername: '',
            proxyPassword: ''
          }
          this.dialogFormVisibleAddProxy = true
          this.$nextTick(()=>{
            this.$refs.addForm.resetFields();
          });
        },
        delProxy(pid){
          if(this.form.name!=''){
            // console.log(pid);
            this.$confirm('确认删除吗?', '删除', {})
            .then(() => {
                const para = {
                  del: pid
              }
              delProxyData(para).then(res => {
                  this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.proxy.splice(this.form.proxyPick, 1)
                this.form.proxyPick = '';
                this.form.protocol = '';
                this.form.address = '';
                this.form.port = '';
                this.form.username = '';
                this.form.password = '';
              }).catch(e => {
              console.log(e)
            })
            })
          }
        },
        handleBeforeClose(done) {
          // 重置表单验证信息和表单数据
          this.$refs.addForm.clearValidate()
          this.$refs.addForm.resetFields()
          done()
        },        
        checkStringLength(rule, value, callback){
          switch (rule.field) {
            case "proxyName":
              if (value.length<1 || value.length>10){
                callback(new Error('代理名称长度应该在1~10位'));
              }else{
                callback();
              }
              break;
            case "proxyProtocol":
              if (value!='0' && value!='1' && value!='2'){
                callback(new Error('Protocol Error!'));
              }else{
                callback();
              }
            case "proxyPort":
              if(/^\d+$/.test(value)){
                if (value*1<1 || value*1>65535){
                  callback(new Error('端口错误!'));
                }else{
                  callback();
                }
              }else{
                callback(new Error('端口错误!'));
              }
            case "proxyUsername":
              if (value!=null && value.length>30){
                callback(new Error('用户名不能超过30位'));
              }else{
                callback();
              }
            case "proxyPassword":
              if (value!=null && value.length>30){
                callback(new Error('密码不能超过30位'));
              }else{
                callback();
              }
            default:
              callback();
              break;
          }
        },
        formatMethod:function(methodNum){
          const methodsDict = {'0':'HEAD', '1':'PUT', '2':'PATCH', '3':'DELETE', '4':'OPTIONS', '5':'CONNECT', '6':'TRACE', '7':'MOVE', '8':'PROPFIND', '9':'COPY'};
          const result = [];
          if (/^\d+$/.test(methodNum)){
            const contentArray = methodNum.toString().split('');
            for (let i = 0; i < contentArray.length; i++) {
            const index = contentArray[i];
            if (methodsDict[index]) {
              result.push(methodsDict[index]);
            }
          }
          return result;
          }else{
            const methodsArray = methodNum.split(',');
            const result = [];
            for (let i = 0; i < methodsArray.length; i++) {
              const method = methodsArray[i].trim();
              const key = Object.keys(methodsDict).find(k => methodsDict[k] === method);
              if (key !== undefined) {
                result.push(key);
              }
            }
            return result.join('');
          }
        },
        getTaskDetil:function(i){
          this.form.SID = this.savedTask[i].SID;
          this.form.task_scheme_name = this.savedTask[i].task_scheme_name;
          this.form.task_max_thread = this.savedTask[i].task_max_thread,
          this.form.task_timeout = this.savedTask[i].task_timeout,
          this.form.task_recursion_depth = this.savedTask[i].task_recursion_depth,
          this.form.task_retry_times = this.savedTask[i].task_retry_times,
          this.form.task_response_size = this.savedTask[i].task_response_size,
          this.form.task_request_speed = this.savedTask[i].task_request_speed,
          this.checkedMethod = this.formatMethod(this.savedTask[i].task_request_method),
          this.form.task_request_queue = this.savedTask[i].task_request_queue,
          this.form.task_draw_wait = this.savedTask[i].task_draw_wait,
          this.form.task_user_agent = this.savedTask[i].task_user_agent,
          this.form.task_host_white_list = this.savedTask[i].task_host_white_list,
          this.form.task_host_black_list = this.savedTask[i].task_host_black_list,
          this.form.task_port_white_list = this.savedTask[i].task_port_white_list,
          this.form.task_port_black_list = this.savedTask[i].task_port_black_list,
          this.form.task_ip_white_list = this.savedTask[i].task_ip_white_list,
          this.form.task_ip_black_list = this.savedTask[i].task_ip_black_list
        },
      clearProxy:function(){        
        for (let prop in this.form) {
          if (this.form.hasOwnProperty(prop)) {
            this.form[prop] = '';
          }
        }
      },
      addProxyData: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {})
            .then(() => {
              // console.log(this.addForm)
              const para = Object.assign({}, this.addForm)
              addProxy(JSON.stringify(para)).then(res => {
                  this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.dialogFormVisibleAddProxy = false
                this.proxy = [];
                // this.proxy.splice(this.form.proxyPick, 1)
                // this.getRes('selectAllTouches',1)
              }).catch(e => {
              console.log(e)
            })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
  },
  mounted() {
    this.getTaskData()    
  }
}
</script>