<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" :rules="searchRules" ref="searchPocs" @submit.native.prevent>
				<el-form-item prop="key">
					<el-input v-model="filters.key" placeholder="漏洞名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchPocs">查询</el-button>
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
			<el-table-column prop="PID" label="PID" width="120">
			</el-table-column>
			<el-table-column prop="name" label="漏洞名称" min-width="160"  :formatter="formatValue">
			</el-table-column>
            <el-table-column prop="timeStamp" label="更新时间" width="180">
			</el-table-column>
			<el-table-column prop="rating" label="级别" width="120">
              <template slot-scope="scofe">
                  <el-tag :style="scofe.row.rating == '0' ? 'color: RGB(103,194,58)' : (scofe.row.rating == '1'? 'color : RGB(102,169,201)' : (scofe.row.rating == '2' ? 'color: RGB(240,156,90)' : 'color: RGB(122,115,116)')) ">{{ formatRating(scofe.row.rating) }}</el-tag>
              </template>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="120">
              <template slot-scope="scopeState">
                <el-tag :type="scopeState.row.state=='1' ? 'success' : 'warning'">{{ formatState(scopeState.row.state) }}</el-tag>
              </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click.stop="handleEdit(scope.$index, scope.row)">详情</el-button>
					<el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
				<el-form-item label="漏洞名称" prop="edit_name">
                    <div style="display: flex; align-items: center;">
                        <i class="el-icon-s-flag"></i>
                        <span style="margin-right: 10px;">
                            &nbsp;&nbsp;&nbsp;
                        </span>
				        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </div>
				</el-form-item>
            <el-form-item label="更新时间" prop="edit_timeStamp">
                <div style="display: flex; align-items: center;">
                    <i class="el-icon-time"></i>
                    <span style="margin-right: 10px;">
                        &nbsp;&nbsp;&nbsp;
                    </span>
                    <el-input v-model="editForm.timeStamp" :disabled="true"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="漏洞介绍" prop="edit_introduction">
                <div style="display: flex; align-items: flex-start;">
                    <i class="el-icon-data-analysis" style="margin-top: 14px;"></i>
                    <span style="margin-right: 10px;">
                        &nbsp;&nbsp;&nbsp;
                    </span>
                <el-input type="textarea" rows="5" v-model="editForm.introduction" placeholder="漏洞相关介绍"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="修复建议" prop="edit_suggestion">
                <div style="display: flex; align-items: flex-start;">
                    <i class="el-icon-aim" style="margin-top: 14px;"></i>
                    <span style="margin-right: 10px;">
                        &nbsp;&nbsp;&nbsp;
                    </span>
                    <el-input type="textarea" rows="5" v-model="editForm.suggestion" placeholder="漏洞修复建议"></el-input>
                </div>
            </el-form-item>            
			<el-form-item label="漏洞等级" prop="edit_rating">
				<el-radio-group v-model="editForm.rating">
					<el-radio class="radio" :label=0>低危</el-radio>
					<el-radio class="radio" :label=1>中危</el-radio>
                    <el-radio class="radio" :label=2>高危</el-radio>
				</el-radio-group>
		    </el-form-item>
            <el-form-item label="漏洞状态" prop="edit_state">
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
            <el-form-item label="漏洞名称" prop="add_name">
                    <div style="display: flex; align-items: center;">
                        <i class="el-icon-s-flag"></i>
                        <span style="margin-right: 10px;">
                            &nbsp;&nbsp;&nbsp;
                        </span>
				        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </div>
				</el-form-item>
            <el-form-item label="漏洞介绍" prop="add_introduction">
                <div style="display: flex; align-items: flex-start;">
                    <i class="el-icon-data-analysis" style="margin-top: 14px;"></i>
                    <span style="margin-right: 10px;">
                        &nbsp;&nbsp;&nbsp;
                    </span>
                <el-input type="textarea" rows="5" v-model="addForm.introduction" placeholder="漏洞相关介绍"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="修复建议" prop="add_suggestion">
                <div style="display: flex; align-items: flex-start;">
                    <i class="el-icon-aim" style="margin-top: 14px;"></i>
                    <span style="margin-right: 10px;">
                        &nbsp;&nbsp;&nbsp;
                    </span>
                    <el-input type="textarea" rows="5" v-model="addForm.suggestion" placeholder="漏洞修复建议"></el-input>
                </div>
            </el-form-item>            
			<el-form-item label="漏洞等级" prop="add_rating">
				<el-radio-group v-model="addForm.rating">
					<el-radio class="radio" :label=0>低危</el-radio>
					<el-radio class="radio" :label=1>中危</el-radio>
                    <el-radio class="radio" :label=2>高危</el-radio>
				</el-radio-group>
		    </el-form-item>
            <el-form-item label="漏洞状态" prop="add_state">
				<el-radio-group v-model="addForm.state">
					<el-radio class="radio" :label=0>锁定</el-radio>
					<el-radio class="radio" :label=1>正常</el-radio>
				</el-radio-group>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisibleAdd=false">取消</el-button>
			    <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
                <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {
  getallpocs,
  editpocs
} from '@/api/poc'


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
      lastKey: "selectAllPocs",
      editFormRules: {
        name: [{ required: true, message: '请输入指纹名称', trigger: 'submit' },
        { max: 50, message: '漏洞名称长度不能超过50个字符', trigger: 'submit' }],
        rating: [{ required: true, message: '请选择漏洞级别', trigger: 'submit' },],
        state: [{ required: true, message: '请选择漏洞状态', trigger: 'submit' },],
        suggestion: [{ validator: this.checkInputListLength, trigger: 'blur' }],
        introduction: [{ validator: this.checkInputListLength, trigger: 'blur' }],
      },
      searchRules: {
        key: [{required: true, message: '请输入漏洞名称', trigger: 'blur'},
          { validator: this.checkStringLength, trigger: 'blur' }
        ]
      },
      // 编辑界面数据
      editForm: {
        PID: 0,
        name: '',
        timeStamp: '',
        introduction: '',
        rating: 0,
        suggestion: '',
        state: 1,
      },
      addForm: {
        name: '',
        introduction: '',
        rating: 0,
        suggestion: '',
        state: 1,
      },
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入漏洞名称', trigger: 'blur' },
        { max: 50, message: '漏洞名称长度不能超过50个字符', trigger: 'blur' }],
        introduction: [{ validator: this.checkInputListLength, trigger: 'blur' }],
        suggestion: [{ validator: this.checkInputListLength, trigger: 'blur' }],
        rating: [{ required: true, message: '请选择漏洞等级', trigger: 'blur' }],
        state: [{ required: true, message: '请选择是否锁定', trigger: 'blur' }]
      }
    }
  },
  methods: {
    checkInputListLength(rule, value, callback) {
      if (value){
        let valueNew = value.filter(Boolean);
        let totalLengthAll = valueNew.join('').length+(valueNew.length-1)*4;
        if (totalLengthAll > 300){
            callback(new Error('总长度不能超过300'));
        } else {
            callback();
        }
      }
    },
    formatValue: function(row, column){
      return row.name
    },
    searchPocs(){
      if(this.filters.key != this.lastKey && this.filters.key!=''){
        this.currentPage = 1;
      }
        this.$refs.searchPocs.validate(valid => {
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
    formatRating: function(value, column) {
      return value == '0' ? '低危' : value == '1' ? '中危' : value == '2' ? '高危' : '未知'
    },
    formatState: function(value, column) {
      return value == '0' ? '锁定' : value =='1' ? '正常' : '未知'
    },
    cancelAdd(){
      this.dialogFormVisibleAdd = false;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRes(this.filters.key,this.currentPage);
    },
    getRes(searchKey,limitPage) {
      this.show = []
      const para = {
        key: searchKey,
        page: limitPage
      }
      getallpocs(para).then(res => {
        this.total = res.count !== -1 ? res.count : res.list.length;
        if (this.currentPage-(Math.floor(this.total/15))>=2)
          this.currentPage = 1
        for (let i = 0; i < res.list.length; i++) {
          this.show.push({
            PID: res.list[i].PID,
            timeStamp: res.list[i].timeStamp,
            name: res.list[i].name,
            introduction: res.list[i].introduction,
            rating: res.list[i].rating,
            suggestion: res.list[i].suggestion,
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
          const para = { PID: row.PID }
          editpocs(para, "del").then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
          this.getRes("selectAllPocs",1)
        })
        .catch(() => {})
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisibleEdit = true
      this.dialogFormVisibleAdd = false
      this.editForm.PID = row.PID;
      this.editForm.name = row.name;
      this.editForm.timeStamp = row.timeStamp;
      this.editForm.suggestion = row.suggestion;
      this.editForm.introduction = row.introduction;
      this.editForm.rating = row.rating;
      this.editForm.state = row.state;
      this.$nextTick(()=>{
        this.$refs.editForm.clearValidate();
      });
    },
    // 显示新增界面
    handleAdd() {
      this.addForm = {
        rating: 0,
        name: '',
        suggestion: '',
        introduction: '',
        state: 1
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
              console.log(para)
              editpocs(JSON.stringify(para), "upd").then(res => {
                  this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisibleEdit = false
                this.getRes('selectAllPocs',1)
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
              editpocs(JSON.stringify(para), "ins").then(res => {
                  this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.dialogFormVisibleAdd = false
                this.getRes('selectAllPocs',1)
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
    this.getRes('selectAllPocs',1);
  }
}
</script>
<style scoped>
</style>