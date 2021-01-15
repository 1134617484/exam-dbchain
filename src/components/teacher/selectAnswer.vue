//查询所有题库
<template>
  <div class="exam">
    <el-table
      :data="pagination.records"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        fixed="left"
        prop="subject"
        label="试卷名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="question"
        label="题目信息"
        width="490"
      ></el-table-column>
      <el-table-column
        prop="section"
        label="所属章节"
        width="200"
      ></el-table-column>
      <el-table-column prop="status" label="题目类型" width="200">
        <template slot-scope="scope">
          <span>{{
            scope.row.status == "3"
              ? "判断题"
              : scope.row.status == "2"
              ? "填空"
              : "选择"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        label="试题分数"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="level"
        label="难度等级"
        width="133"
      ></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[6, 10]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      class="page"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableDataAll: [],
      pagination: {
        //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
      },
    };
  },
  created() {
    this.getAnswerInfo();
  },
  methods: {
    async getAnswerInfo() {
      let data = [];
      // 获取所有题，按时间排序，同时打上标记
      let fill_question = await this.$DBChain
        .Querier(this.appCode)
        ["fill_question"].val();
      fill_question.forEach((element) => {
        if (element.type !== 0) {
          element.status = "2";
          // data[data.length] = element;
          data.push(element)
        }
      });
      let multi_question = await this.$DBChain
        .Querier(this.appCode)
        ["multi_question"].val();
      multi_question.forEach((element) => {
        if (element.type !== 0) {
          element.status = "1";
          // data[data.length] = element;
          data.push(element)
        }
      });
      let judge_question = await this.$DBChain
        .Querier(this.appCode)
        ["judge_question"].val();
      judge_question.forEach((element) => {
        if (element.type !== 0) {
          element.status = "3";
          // data[data.length] = element;
          data.push(element)
        }
      });
      console.log(fill_question, multi_question, judge_question);

      //分页查询所有试卷信息

      console.log(data);
      this.tableDataAll = data;
      this.pagination.total = data.length;
      this.changeTablePage(this.pagination.current, this.pagination.size);
      // this.$forceUpdate();
      // this.$axios(
      //   `${this.API}/api/answers/${this.pagination.current}/${this.pagination.size}`
      // )
      //   .then(res => {
      //     this.pagination = res.data.data;
      //     console.log(res);
      //   })
      //   .catch(error => {});
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.changeTablePage();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.changeTablePage();
    },
    //
    // 切换页数
    changeTablePage(
      page = this.pagination.current,
      row = this.pagination.size
    ) {
      console.log(page, row);
      // let length = this.pagination.total;
      // let numPage = Math.ceil(length / row);
      // console.log(numPage);
      // this.selected.page = Array.from(Array(numPage), (v, k) => k + 1);
      // this.pagination.current>this.selected.page[this.selected.page.length-1]?this.search.page=this.selected.page[this.selected.page.length-1]:''
      // page=this.search.page;
      this.pagination.records = [...this.tableDataAll].slice((page - 1)*row, page*row);
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
  },
  computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
  },
};
</script>
<style lang="scss" scoped>
.exam {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit {
    margin-left: 20px;
  }
  .el-table tr {
    background-color: #dd5862 !important;
  }
}
.el-table .warning-row {
  background: #000 !important;
}

.el-table .success-row {
  background: #dd5862;
}
</style>
