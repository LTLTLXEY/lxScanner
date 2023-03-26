<template>
    <div class="app-container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-order"></i> 扫描 </el-breadcrumb-item>
                <el-breadcrumb-item>新建任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="任务名称">
                        <el-input v-model="form.taskName"></el-input>
                    </el-form-item>
                    <el-form-item label="资产列表">
                        <el-input type="textarea" ref="assetRef" rows="5" v-model="form.asset" placeholder="逐行输入扫描目标地址" @blur.prevent="formatCont()"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-upload ref="uploadAsset" action="alert" :auto-upload="false" :file-list="uploadFiles" :on-change="loadTagetFromFile" accept=".txt" >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button size="small" @click="submitFile">上传</el-button>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="Headers">
                      <el-input type="textarea" rows="5" v-model="form.headers" placeholder="逐行输入自定义Headers"></el-input>
                    </el-form-item>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="网络代理">
                          <el-select v-model="form.proxyPick" placeholder="选择代理" @change="getProxyDetil($event)">
                            <el-option v-for="(item, index) in proxy" :key="index" :label="item.name" :value="index"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label-width="5px">
                          <el-button type="primary" plain @click="handleAddProxy">新增</el-button>
                          <el-button type="warning" v-model="proxy" plain @click="delProxy(form.pid)" style="margin: 0;">删除</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row> 
                    <el-row>
                        <el-col :span="7">
                          <el-form-item label="">
                            <el-select v-model="form.protocol" placeholder="协议">
                                <el-option key="SOCKS5" label="SOCKS5" value="SOCKS5"></el-option>
                                <el-option key="HTTPS" label="HTTPS" value="HTTPS"></el-option>
                                <el-option key="HTTP" label="HTTP" value="HTTP"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                          <el-col :span="6">
                            <el-form-item label-width="2px">
                              <el-input v-model="form.address" placeholder="IP"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label-width="2px">
                              <el-input v-model="form.port" placeholder="PORT"></el-input>
                          </el-form-item>
                        </el-col>                        
                        <el-col :span="3">
                            <el-form-item label-width="2px">
                              <el-input v-model="form.username" placeholder="用户名"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="2px">
                              <el-input :type="passwd" v-model="form.password" placeholder="密码">
                                <i slot="suffix" :class="icon" @click="showPass"></i>
                              </el-input>
                          </el-form-item>
                        </el-col>                        
                    </el-row>
                    <el-form-item label="模式选择">
                        <el-select v-model="form.pattern" placeholder="请选择扫描模式">
                            <el-option key="主动模式" label="主动模式" value="zd"></el-option>
                            <el-option key="被动模式" label="被动模式" value="bd"></el-option>
                            <el-option key="混合模式" label="混合模式" value="hh"></el-option>
                            <el-option key="识别模式" label="识别模式" value="sb"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配置选择">
                        <el-select v-model="form.config" placeholder="请选择扫描器配置">
                            <el-option key="配置1" label="配置1" value="pz1"></el-option>
                            <el-option key="配置2" label="配置2" value="pz2"></el-option>
                            <el-option key="配制3" label="配制3" value="pz3"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item> -->
                    <!-- <el-form-item label="城市级联">
                        <el-cascader :options="options" v-model="form.options"></el-cascader>
                    </el-form-item> -->
                    <!-- <el-form-item label="选择开关">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="多选框">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="步步高" name="type"></el-checkbox>
                            <el-checkbox label="小天才" name="type"></el-checkbox>
                            <el-checkbox label="imoo" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="步步高"></el-radio>
                            <el-radio label="小天才"></el-radio>
                            <el-radio label="imoo"></el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">任务提交</el-button>
                        <el-button>取消</el-button>
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
    export default {
      name: 'taskForm',
      data: function() {
        return {
          form: {
            taskName: '',
            pid: 1,
            name: '',
            asset: '',
            headers: '',
            protocol: '',
            proxyPick: '',
            address: '',
            port: '',
            username: '',
            password: '',
            pattern: ['主动模式'],
            config: ['配置1']
          },
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