// 所有学生
<template>
  <div class="all">
    <el-table :data="pagination.records" border>
      <el-table-column
        fixed="left"
        prop="student_name"
        label="姓名"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="institute"
        label="学院"
        width="200"
      ></el-table-column>
      <el-table-column prop="major" label="专业" width="200"></el-table-column>
      <el-table-column prop="grade" label="年级" width="200"></el-table-column>
      <el-table-column prop="clazz" label="班级" width="100"></el-table-column>
      <el-table-column prop="sex" label="性别" width="120"></el-table-column>
      <el-table-column
        prop="tel"
        label="联系方式"
        width="120"
      ></el-table-column>
      <el-table-column fixed="right" label="查看成绩" width="150">
        <template slot-scope="scope">
          <el-button
            @click="checkGrade(scope.row)"
            type="primary"
            size="small"
            >查看成绩</el-button
          >
        </template>
      </el-table-column>
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
import {mapState} from 'vuex';
import {
  ArrdeWeight
} from '@/utils/mUtils'
export default {
  data() {
    return {
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
      let address = this.$DBChain.getAddress();
      console.log(address);
      if (this.userType == "0") {
        // 若时管理员，则查所有数据
        //分页查询所有试卷信息
        let studentAll = await this.$DBChain
          .Querier(this.appCode)
          .student.compareAll([["status", "1"]])
          .val();
        console.log(studentAll);
        this.pagination.records = studentAll;
      } else {
        // 反之，查自己的学生的数据
        // 过滤逻辑：找出所有能用的（status=1）数据。倒序后address去重则可获得符合条件的最后一条数据
        // 先找到自己作为教师的id，再去学生表查出我的所有status为1的学生
        let teacherAll = await this.$DBChain
          .Querier(this.appCode)
          .teacher.compareAll([
            ["address", address],['status','1']
          ])
          .val();
          console.log(teacherAll);
      
        // 若有多条符合，则合并(即取出该地址的所有身份，合并)
        let data=[]
        for(let i=0;i<teacherAll.length;i++){
          // 每个身份下对应的学员
          let studentAll = await this.$DBChain
          .Querier(this.appCode)
          .student.compareAll([
            ["teacher_id", teacherAll[i].id],
            ["status", "1"],
          ])
          .val();
        console.log(studentAll);
        data=[...data,...studentAll]
          // data[data.length]=['teacher_id',teacherAll[i].id]
        }
        console.log(data)
        //分页查询所有试卷信息

        this.pagination.records = data;
      }

      this.loading = false;
      this.$forceUpdate();
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getAnswerInfo();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getAnswerInfo();
    },
    checkGrade(row) {
      this.$router.push({ path: "/grade", query: { studentId: row.id } });
    },
  },
  computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
    ...mapState(["userType"]),
  },
};
</script>
<style lang="scss" scoped>
.all {
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
