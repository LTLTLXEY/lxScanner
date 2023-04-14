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
                        <el-select v-model="form.proxyPick" placeholder="空方案" @change="getProxyDetil($event)">
                            <el-option v-for="(item, index) in proxy" :key="index" :label="item.name" :value="index"></el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-form-item label="方案名称">
                        <el-input v-model="form.taskSchemeName"></el-input>
                    </el-form-item>
                    <el-form-item label="最大线程">
                        <el-input-number v-model="form.taskMaxThread"></el-input-number>
                    </el-form-item>
                    <el-form-item label="超时设置">
                        <el-input-number v-model="form.taskTimeout"></el-input-number>
                    </el-form-item>
                    <el-form-item label="递归深度">
                        <el-input-number v-model="form.taskRecursionDepth"></el-input-number>
                    </el-form-item>
                    <el-form-item label="重试次数">
                        <el-input-number v-model="form.taskRetryTimes"></el-input-number>
                    </el-form-item>
                    <el-form-item label="响应大小">
                        <el-input-number v-model="form.taskResponseSize"></el-input-number>
                    </el-form-item>
                    <el-form-item label="请求速度">
                        <el-input-number v-model="form.taskRequestSpeed"></el-input-number>
                    </el-form-item>
                    <el-form-item label="请求队列">
                        <el-input-number v-model="form.taskRequestQueue"></el-input-number>
                    </el-form-item>                    
                    <el-form-item label="请求方法">
                            <el-checkbox-group size="small" v-model="checkedMethod">
                                <el-checkbox style="width: 93px;margin-right: 1px;" border v-for="item in selectedMethodsForm1" :disabled="item === 'GET' || item === 'POST'" :key="item" :checked="item === 'GET' || item === 'POST'" :label="item">{{item}}</el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group size="small" v-model="checkedMethod" style="margin-top: 4px;">
                                <el-checkbox style="width: 93px;margin-right: 1px;" border v-for="item in selectedMethodsForm2" :key="item" :label="item">{{item}}</el-checkbox>
                            </el-checkbox-group>                            
                    </el-form-item>
                    <el-form-item label="UserAgent">
                        <el-input v-model="form.taskUserAgent" type="textarea" ref="uaRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="主机白名单">
                        <el-input v-model="form.taskHostWhiteList" type="textarea" ref="whostRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="主机黑名单">
                        <el-input v-model="form.taskHostBlackList" type="textarea" ref="bhostRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="端口白名单">
                        <el-input v-model="form.taskPortWhiteList" type="textarea" ref="wportRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="端口黑名单">
                        <el-input v-model="form.taskPortBlackList" type="textarea" ref="bportRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="IP白名单">
                        <el-input v-model="form.taskIPWhiteList" type="textarea" ref="wipRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="IP黑名单">
                        <el-input v-model="form.taskIPBlackList" type="textarea" ref="bipRef" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="字典管理">
                        <el-input v-model="form.taskDictionary"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
      		<el-dialog title="新增代理" :visible.sync="dialogFormVisibleAddProxy" :close-on-click-modal="false" :before-close="handleBeforeClose">
          <el-form :model="addForm" label-width="80px" :rules="addProxyRules" ref="addForm" :keep-alive="false">
            <el-form-item label="代理名称" prop="proxyName">
              <div style="display: flex; align-items: center;">
                <el-input auto-complete="off" placeholder="请输入代理名称" v-model="addForm.proxyName"></el-input>
              </div>
            </el-form-item>
              <el-form-item label="协议类型" prop="proxyProtocol">
                <el-radio-group v-model="addForm.proxyProtocol">
                  <el-radio class="radio" :label=0>SOCKS5</el-radio>
                  <el-radio class="radio" :label=1>HTTPS</el-radio>
                  <el-radio class="radio" :label=2>HTTP</el-radio>
                </el-radio-group>
              </el-form-item>
            <el-form-item label="代理地址" prop="proxyAddress">
              <div style="display: flex; align-items: center;">
                <el-input auto-complete="off" placeholder="请输入代理地址" v-model="addForm.proxyAddress"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="代理端口" prop="proxyPort">
              <div style="display: flex; align-items: center;">
                <el-input auto-complete="off" placeholder="请输入代理端口" v-model="addForm.proxyPort"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="用户名" prop="proxyUsername">
              <div style="display: flex; align-items: center;">
                <el-input auto-complete="off" placeholder="请输入用户名" v-model="addForm.proxyUsername"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="密码" prop="proxyPassword">
              <div style="display: flex; align-items: center;">
                <el-input auto-complete="off" placeholder="请输入密码" v-model="addForm.proxyPassword"></el-input>
              </div>
            </el-form-item>                  
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="cancelAdd">取消</el-button>
            <el-button type="primary" @click="addProxyData">添加</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { getProxy,addProxy,delProxyData } from '@/api/task.js'
const checkedMethod1 = ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'];
const checkedMethod2 = ['OPTIONS', 'CONNECT', 'TRACE', 'MOVE', 'PROPFIND', 'COPY']
    export default {
      name: 'taskForm',
      data: function() {
        return {
            form: {
                taskSchemeName: '',
                taskMaxThread: '',
                taskTimeout: '',
                taskRecursionDepth: '',
                taskRetryTimes: '',
                taskResponseSize: '',
                taskRequestSpeed: '',
                taskRequestMethod: '',
                taskRequestQueue: '',
                taskUserAgent: '',
                taskHostWhiteList: '',
                taskHostBlackList: '',
                taskPortWhiteList: '',
                taskPortBlackList: '',
                taskIPWhiteList: '',
                taskIPBlackList: '',
                taskDictionary: '',
            },
          selectedMethodsForm1: checkedMethod1,
          selectedMethodsForm2: checkedMethod2,
          checkedMethod: [], // 存储已选中的请求方式
          proxy: [],
          uploadFiles: [],
          passwd:"password",
          icon:"el-icon-view",
          dialogFormVisibleAddProxy: false,
        addForm: {
            proxyName: '',
            proxyProtocol: 0,
            proxyAddress: '',
            proxyPort: '',
            proxyUsername: '',
            proxyPassword: ''
          }, 
        addProxyRules: {
            proxyName: [{required: true, message: '代理名称长度应该在1~10位', trigger: 'blur', min: 1, max: 10},
              { validator: this.checkStringLength, trigger: 'blur' }],
            proxyProtocol: [{required: true,message: '请选择协议类型'},
              { validator: this.checkStringLength, trigger: 'submit' }],
            proxyAddress: [{required: true,message: '请输入地址'},
              { validator: this.checkStringLength, trigger: 'blur' }],
            proxyPort: [{required: true,message: '端口应该低于65535'},
              { validator: this.checkStringLength, trigger: 'blur' }],
            proxyUsername: [{ validator: this.checkStringLength, trigger: 'blur' }],
            proxyPassword: [{ validator: this.checkStringLength, trigger: 'blur' }],
          },
        }
      },
      methods: {
        onSubmit() {
          this.$message.success('提交成功！')
        },
        loadTagetFromFile(file, fileList) {
          this.uploadFiles = fileList
        },
        cancelAdd(){
          this.dialogFormVisibleAddProxy = false;
        },    
        formatCont:function(){
          this.form.asset = this.form.asset.replace(/\s+\r\n/g, "\r\n");
        },
        showPass:function(){
        if( this.passwd == "text" ) {
            this.passwd = "password"
            this.icon = "el-icon-view"
          } else {
            this.passwd = "text"
            this.icon = "el-icon-unlock"
          };
        },
        getProxyData:function(ID){
          const para = {
            func: ID
          }
          getProxy(para).then(res => {
            for (let i = 0; i < res.length; i++){
              this.proxy.push({
                pid: res[i].PID,
                name: res[i].name,
                protocol: res[i].protocol,
                address: res[i].address,
                port: res[i].port,
                username: res[i].username,
                password: res[i].password
              })
            }
            // console.log(this.proxy[0])
          }).catch((e) => {
              console.log(e)
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
        getProxyDetil:function(id){
          this.form.pid = this.proxy[id].pid;
          this.form.name = this.proxy[id].name;
          this.form.protocol = this.proxy[id].protocol;
          this.form.address = this.proxy[id].address;
          this.form.port = this.proxy[id].port;
          this.form.username = this.proxy[id].username;
          this.form.password = this.proxy[id].password;
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
                this.getProxyData(0)
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
        submitFile() {
          for (let i = 0; i < this.uploadFiles.length; i++) {
            const file = this.uploadFiles[i]
            if (file.name.endsWith('.txt')){
              let reader = new FileReader()
              reader.readAsText(file.raw)
              reader.onload = () => {
                this.form.asset += reader.result;
                this.form.asset ? '' : this.form.asset = '\n\r'+this.form.asset
              }
            }else{
              Message({
                message: '只能读取TXT文件',
                type: 'warning',
                duration: 3 * 1000
              })
            }
            }
            // console.log(this.form.asset)
            this.uploadFiles = [];
            this.$refs.assetRef.focus();
	      }
      },
  mounted() {
    this.getProxyData(0)
  }
}
</script>