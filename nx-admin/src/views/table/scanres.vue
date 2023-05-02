<template>
	<section class="app-container">
		<!--列表-->
		<el-table :data="scanres" highlight-current-row style="width: 100%;">
                <el-table-column prop="uid" label="ID" width="120">
                </el-table-column>
                <el-table-column prop="url" label="URL">
                    <template slot-scope="scope">
                    <a :href="scope.row.url" target="_blank" style="color:#61ac85;">{{ scope.row.url }}</a>
                </template>
                </el-table-column>
                <el-table-column prop="touchID" label="指纹内容" min-width="160">
                  <template slot-scope="scofe">
                    <span v-for="(touchID, index) in formatValue(scofe.row.touchID)" :key="index">
                      <el-tag size="small" style="margin-right: 4px;margin-bottom: 4px;">{{ touchID }}</el-tag>
                    </span>
                  </template>
                </el-table-column>
		</el-table>
	</section>
</template>

<script>
import { getScanRes,getTouchKey } from '@/api/task'

export default {
  data() {
    return {
      scanres: [],
      touchesID: {}
    }
  },
  methods: {
  async getData() {
    const {Tid} = this.$route.query;
    if (Tid) {
      try {
        const querydata = {Tid: Tid};
        const res = await getScanRes(querydata);
        for (let i = 0; i < res.scanres.length; i++) {
          this.scanres.push({
            uid: res.scanres[i].UID,
            url: res.scanres[i].url,
            touchID: res.scanres[i].touchID
          });
        }
        await this.getTouchID(res);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  },
  async getTouchID(listID) {
    const touchesIDList = [];
    for (let i = 0; i < listID.scanres.length; i++) {
      const singleList = JSON.parse(listID.scanres[i].touchID);
      for (let j = 0; j < singleList.length; j++) {
        if (!touchesIDList.includes(singleList[j])) {
          touchesIDList.push(singleList[j]);
        }
      }
    }
    const para = touchesIDList.join(',');
    const res = await getTouchKey(para);
    this.touchesID = JSON.parse(res.data);
  },
  formatValue: function(row, column){
    const tmpList = JSON.parse(row)
    const touchList = []
    for (let i=0;i<tmpList.length;i++){
      touchList.push(this.touchesID[tmpList[i]])
    }
    return touchList
  },
},
mounted() {
  this.getData();
}

}
</script>
<style scoped>
</style>