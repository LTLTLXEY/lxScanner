<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" :rules="searchRules" ref="searchTouch" @submit.native.prevent>
				<el-form-item prop="key">
					<el-input v-model="filters.key" placeholder="指纹名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchTouches">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="show" highlight-current-row style="width: 100%;" stripe :pagination="{pageSize: 15}">
			<el-table-column type="number" width="50" >
			</el-table-column>
			<!-- <el-table-column type="index" width="60">
			</el-table-column> -->
			<el-table-column prop="tid" label="ID" width="120">
			</el-table-column>
			<el-table-column prop="touchkey" label="指纹名称" width="120">
			</el-table-column>
			<el-table-column prop="touchvalue" label="指纹内容" min-width="160" :formatter="formatValue">
			</el-table-column>
			<el-table-column prop="feature" label="特征来源" width="120">
        <template slot-scope="scofe">
          <el-tag :style="scofe.row.feature == '0' ? 'color: RGB(103,194,58)' : (scofe.row.feature == '1'? 'color : RGB(102,169,201)' : (scofe.row.feature == '2' ? 'color: RGB(240,156,90)' : 'color: RGB(122,115,116)')) ">{{ formatFeature(scofe.row.feature) }}</el-tag>
        </template>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="120">
        <template slot-scope="scopeState">
          <el-tag :type="scopeState.row.state=='1' ? 'success' : 'warning'">{{ formatState(scopeState.row.state) }}</el-tag>
        </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
     <el-pagination
      @current-change="handleCurrentChange"
      @prev-click="prevPage"
      @next-click="nextPage"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :show-page-sizes="false">
    </el-pagination>

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleEdit" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="指纹名称" prop="touchkey">
          <div style="display: flex; align-items: center;">
            <i class="el-icon-s-flag"></i>
            <span style="margin-right: 10px;">&nbsp;&nbsp;&nbsp;</span>
					  <el-input v-model="editForm.touchkey" auto-complete="off"></el-input>
          </div>
				</el-form-item>
        <el-form-item label="指纹内容" prop="touchvalue">
        <div v-for="(value, index) in editForm.touchvalue" :key="index" style="display: flex; align-items: center;">
          <i class="el-icon-menu"></i>
          <span style="margin-right: 10px;">{{ index + 1 }}.</span>
          <el-input v-model="editForm.touchvalue[index]" auto-complete="off"></el-input>
        </div>
        <div style="display: flex; justify-content: flex-start; align-items: center;">
          <el-button @click="addInputForEdit" type="primary" icon="el-icon-plus" circle></el-button>
        </div>
				</el-form-item>
				<el-form-item label="特征来源">
					<el-radio-group v-model="editForm.feature">
						<el-radio class="radio" :label=0>Code</el-radio>
						<el-radio class="radio" :label=1>Headers</el-radio>
            <el-radio class="radio" :label=2>Cookie</el-radio>
					</el-radio-group>
				</el-form-item>
        <el-form-item label="指纹状态">
					<el-radio-group v-model="editForm.state">
						<el-radio class="radio" :label=0>锁定</el-radio>
						<el-radio class="radio" :label=1>正常</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisibleEdit=false">取消</el-button>
			  <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog>

    <!-- 新增界面 -->
    		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleAdd" :close-on-click-modal="false" :before-close="handleBeforeClose">
          <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" :keep-alive="false">
            <el-form-item label="指纹名称" prop="touchkeyAdd">
              <div style="display: flex; align-items: center;">
                <el-input auto-complete="off" placeholder="请输入指纹名称" v-model="addForm.touchkeyAdd"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="指纹内容" prop="inputList">
              <div v-for="(value, index) in addForm.inputList" :key="index" style="display: flex; align-items: center;">
                <el-input v-model="addForm.inputList[index]" placeholder="请逐条输入指纹内容"></el-input>
              </div>
              <div style="display: flex; justify-content: flex-start; align-items: center;">
                <el-button @click="addInput" type="primary" icon="el-icon-plus" circle></el-button>
              </div>
            </el-form-item>
				<el-form-item label="特征来源">
					<el-radio-group v-model="addForm.featureAdd">
						<el-radio class="radio" :label=0>Code</el-radio>
						<el-radio class="radio" :label=1>Headers</el-radio>
            <el-radio class="radio" :label=2>Cookie</el-radio>
					</el-radio-group>
				</el-form-item>
        <el-form-item label="指纹状态">
					<el-radio-group v-model="addForm.stateAdd">
						<el-radio class="radio" :label=0>锁定</el-radio>
						<el-radio class="radio" :label=1>正常</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="cancelAdd">取消</el-button>
			  <el-button type="primary" @click="createData">添加</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {
  removeUser,
  addTouch,
  edittouch,
  getTouches,
} from '@/api/userTable'

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 15,
      total: 0,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      filters: {
        key: ''
      },
      show: [],
      page: 1,
      lastKey: "selectAllTouches",
      editFormRules: {
        touchkey: [{ required: true, message: '请输入指纹名称', trigger: 'submit' },
        { max: 50, message: '指纹名称长度不能超过50个字符', trigger: 'submit' }],
        touchvalue: [{ required: true, message: '请输入指纹内容', trigger: 'submit' },
        { validator: this.checkEditLen, trigger: 'blur' }],
        feature: [{ required: true, message: '请选择指纹特征', trigger: 'submit' },]
      },
      searchRules: {
        key: [{required: true, message: '请输入指纹名称', trigger: 'blur'},
          { validator: this.checkStringLength, trigger: 'blur' }
        ]
      },
      // 编辑界面数据
      editForm: {
        tid: 0,
        touchkey: '',
        touchvalue: [],
        feature: 0,
        state: 1,
      },
      addForm: {
        touchkeyAdd: '',
        featureAdd: 0,
        stateAdd: 1,
        inputList: ['']
      },
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        touchkeyAdd: [{ required: true, message: '请输入指纹名称', trigger: 'blur' },
        { max: 50, message: '指纹名称长度不能超过50个字符', trigger: 'blur' }],
        inputList: [{ required: true, validator: this.checkInputListLength, trigger: 'blur' }],
        featureAdd: [{ required: true, message: '请选择指纹特征', trigger: 'change' }],
        stateAdd: [{ required: true, message: '请选择是否锁定', trigger: 'blur' }]
      }
    }
  },
  methods: {
    checkInputListLength(rule, value, callback) {
      let valueNew = value.filter(Boolean);
      let totalLength = valueNew.join('').length;
      let totalLengthAll = valueNew.join('').length+(valueNew.length-1)*3;
      if(totalLength==0){
        callback(new Error('指纹内容不能为空'));
      }
      if (value.join('').indexOf('|&|') >= 0){
        callback(new Error('指纹内容不能包含定界符|&|'));
      }
      if (totalLength > 300) {
        callback(new Error('指纹内容总长度不能超过300'));
      } else if (totalLengthAll > 350){
        callback(new Error('由于指纹存在定界符,总长度不能超过350'));
      } else {
        callback();
      }
    },
    checkEditLen(rule, value, callback){
      let valueLen = value.join('').length;
      let valenLenAll = valueLen+(value.length-1)*3;
      if(value.join('').indexOf('|&|') >= 0){
        callback(new Error('指纹内容不能包含定界符|&|'));
      }
      if(valueLen==0){
        callback(new Error('指纹内容总长度不能为空'));
      }else if(valueLen>300){
        callback(new Error('指纹内容总长度不能超过300'));
      }else if(valenLenAll>350){
        callback(new Error('由于指纹存在定界符,总长度不能超过350'));
      }else{
        callback();
      }
    },
    searchTouches(){
      if(this.filters.key != this.lastKey && this.filters.key!=''){
        this.currentPage = 1;
      }
        this.$refs.searchTouch.validate(valid => {
      if (valid) {
        this.getRes(this.filters.key,this.currentPage)
      } else {
        this.$message.error('搜索内容在包含中文的情况下不小于2,不含中文需要不小于3个字符长度')
      }
    })
    },
    prevPage() {
      this.currentPage--;
    },
    nextPage() {
      this.currentPage++;
    },
    //检测搜索内容长度
    checkStringLength(rule, value, callback) {
      let isContainChinese = /[\u4e00-\u9fa5]/.test(value);
      let minLen = isContainChinese ? 2 : 3;
      if (value.length < minLen) {
        callback(new Error('字符长度过短'));
      } else {
        callback();
      }
    },
    handleBeforeClose(done) {
      // 重置表单验证信息和表单数据
      this.$refs.addForm.clearValidate()
      this.$refs.addForm.resetFields()
      done()
    },
    // 来源显示转换
    formatFeature: function(value, column) {
      return value == '0' ? 'Code' : value == '1' ? 'Headers' : value == '2' ? 'Cookie' : '未知'
    },
    formatState: function(value, column) {
      return value == '0' ? '锁定' : value =='1' ? '正常' : '未知'
    },
    formatValue: function(row, column){
      return row.touchvalue.join('|&|')
    },
    formatSex: function(row, column) {
      return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
    },
    cancelAdd(){
      this.dialogFormVisibleAdd = false;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRes(this.filters.key,this.currentPage);
    },
    addInput() {
      this.addForm.inputList.push('')
    },
    addInputForEdit() {
      this.editForm.touchvalue.push('')
    },
    getRes(searchKey,limitPage) {
      this.show = []
      const para = {
        key: searchKey,
        page: limitPage
      }
      getTouches(para).then(res => {
        this.total = res.count !== -1 ? res.count : res.list.length;
        if (this.currentPage-(Math.floor(this.total/15))>=2)
          this.currentPage = 1
        for (let i = 0; i < res.list.length; i++) {
          this.show.push({
            tid: res.list[i].TID,
            touchkey: res.list[i].touchKey,
            touchvalue: res.list[i].touchValue,
            feature: res.list[i].feature,
            state: res.list[i].state
            })
          }
      }).catch((e) => {
        console.log(e)
      })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          removeUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // this.getUsers()
          })
        })
        .catch(() => {})
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisibleEdit = true
      this.dialogFormVisibleAdd = false
      this.editForm.tid = row.tid;
      this.editForm.touchkey = row.touchkey;
      this.editForm.touchvalue = row.touchvalue.slice();
      this.editForm.feature = row.feature;
      this.editForm.state = row.state;
      this.$nextTick(()=>{
        this.$refs.editForm.clearValidate();
      });
    },
    // 显示新增界面
    handleAdd() {
      this.addForm = {
        featureAdd: 0,
        touchkeyAdd: '',
        inputList: [''],
        stateAdd: 1
      }
      this.dialogStatus = 'create'
      this.dialogFormVisibleAdd = true
      this.dialogFormVisibleEdit = false
      this.$nextTick(()=>{
        this.$refs.addForm.resetFields();
      });
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              // console.log(para)
              edittouch(JSON.stringify(para)).then(res => {
                  this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisibleEdit = false
                this.getRes('selectAllTouches',1)
              }).catch(e => {
                console.log(e);
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    // 新增
    createData: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.addForm)
              addTouch(JSON.stringify(para)).then(res => {
                  this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.dialogFormVisibleAdd = false
                this.getRes('selectAllTouches',1)
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
    this.getRes('selectAllTouches',1)
  }
}
</script>
<style scoped>
</style>