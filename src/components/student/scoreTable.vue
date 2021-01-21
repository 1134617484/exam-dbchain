//显示学生成绩
<template>
  <div class="table">
    <p class="title">我的分数</p>
    <section class="content-el">
      <el-table ref="filterTable" :data="pagination.records" v-loading="loading">
        <el-table-column
          prop="created_at"
          label="考试日期"
          sortable
          width="300"
          column-key="created_at"
          :filters="filter"
          :filter-method="filterHandler">
          <template slot-scope="scope">
<span>{{getFormatDate(scope.row.created_at)}}</span>
          </template>
          
        </el-table-column>
        <el-table-column
          prop="subject"
          label="课程名称"
          width="300"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag>{{scope.row.subject}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="考试分数" width="200"></el-table-column>
        <el-table-column label="是否及格" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.score>= 60 ? 'success' : 'danger'">{{scope.row.score >= 60 ? "及格" : "不及格"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[4,6,8,10]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </el-row>
    </section>
  </div>
</template>

<script>
import { getFormatDate } from "@/utils/mUtils";
export default {
  data() {
    return {
      pagination: { //分页后的留言列表
        current: 1, //当前页
        total: null, //记录条数
        size: 10 //每页条数
      },
      loading: false, //加载标识符
      score: [], //学生成绩
      filter: null //过滤参数
    }
  },
  created() {
    this.getScore()
    this.loading = true //数据加载则遮罩表格
  },
  methods: {
    async getScore() {
      // 查询我的所有考试成绩
      // own 快捷指令，即查询created_by字段是当前库链地址的所有数据
      let scoreAll=await this.$DBChain
        .Querier(this.appCode)
        .score.own
        .val();
        console.log(scoreAll)
        this.pagination.records=scoreAll;
      this.loading = false;
      this.$forceUpdate();
     
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getScore()
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getScore()
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getFormatDate(date) {
      return getFormatDate(date);
    },
  },
   computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
    }
};
</script>

<style lang="scss" scoped>
.pagination {
  padding-top: 20px;
}
.table {
  width: 980px;
  margin: 0 auto;
  .title {
    margin: 20px;
  }
  .content-el {
    background-color: #fff;
    padding: 20px;
  }
}
</style>
