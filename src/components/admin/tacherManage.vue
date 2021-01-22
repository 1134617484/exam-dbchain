// 教师管理页面
<template>
  <div class="all">
    <el-table :data="pagination.records" border>
      <el-table-column fixed="left" prop="teacher_name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="institute" label="学院" width="200"></el-table-column>
      <el-table-column prop="sex" label="性别" width="120">
        <template slot-scope="scope">{{scope.row.sex=='0'?'女':'男'}}</template>
      </el-table-column>
      <el-table-column prop="tel" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="email" label="密码" width="120"></el-table-column>
      <el-table-column prop="card_id" label="身份证号" width="120"></el-table-column>
       <el-table-column prop="address" label="库链地址" width="120"></el-table-column>
      <el-table-column prop="type" label="职称" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="checkGrade(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteById(scope.row)" type="danger" size="small">删除</el-button>
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
      class="page">
    </el-pagination>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑试卷信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.teacher_name"></el-input>
          </el-form-item>
          <el-form-item label="学院">
            <el-input v-model="form.institute"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="form.sex"></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.pwd"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="form.card_id"></el-input>
          </el-form-item>
          <el-form-item label="职称">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let that;
import { ArrdeWeight,removeNull } from "@/utils/mUtils";
export default {
  data() {
    return {
      tableDataAll:[],
      pagination: {
        //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
      },
      dialogVisible: false, //对话框
      form: {}, //保存点击以后当前试卷的信息
    };
  },
  created() {
    that = this;
    this.getTeacherInfo();
  },
  methods: {
    async getTeacherInfo() {
      //       // 先查出所有教师，然后先地址去重以减少数组，后去遍历所有教师取出当前库链地址下最后一条数据
      let studentAll = await this.$DBChain
        .Querier(this.appCode)
        ["teacher"].equal('status','1').val();
      studentAll.reverse();
      studentAll = ArrdeWeight(studentAll, "address");
      console.log(studentAll);
      // this.pagination.records=studentAll;
      this.tableDataAll = studentAll;
      this.pagination.total = studentAll.length;
         
      //分页查询所有试卷信息
      // this.$axios(`${this.API}/api/teachers/${this.pagination.current}/${this.pagination.size}`).then(res => {
      //   this.pagination = res.data.data;
      // }).catch(error => {});
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      // this.getTeacherInfo();
      this.changeTablePage();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      // this.getTeacherInfo();
      this.changeTablePage();
    },
    checkGrade(row) { //修改教师信息
      this.dialogVisible = true;
      this.form = row;
      // this.$axios(`${this.API}/api/teacher/${teacherId}`).then(res => {
      //   this.form = res.data.data
      // })
    },
    deleteById(row) { //删除当前学生
    let data={...row};
      console.log(data)
      data.id=null;
      data.created_at=null;
      data.created_by=null;
      data.status="0";
      data=removeNull(data);
      console.log(data)
      this.$confirm("确定删除当前教师吗？删除后无法恢复","Warning",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着吧',
        type: 'danger'
      }).then(()=> { //确认删除
      this.insertRow(data, "teacher", "教师删除成功");
        // this.$axios({
        //   url: `${this.API}/api/teacher/${teacherId}`,
        //   method: 'delete',
        // }).then(res => {
        //   this.getTeacherInfo()
        // })
      }).catch(() => {

      })
    },
    submit() { //提交更改
      this.dialogVisible = false;
      let data={...this.form,...{status:"1"}};
      console.log(data)
      this.insertRow(data, "teacher", "学生信息编辑成功");
      // this.$axios({
      //   url: '/api/teacher',
      //   method: 'put',
      //   data: {
      //     ...this.form
      //   }
      // }).then(res => {
      //   console.log(res)
      //   if(res.data.code ==200) {
      //     this.$message({
      //       message: '更新成功',
      //       type: 'success'
      //     })
      //   }
      //   this.getTeacherInfo()
      // })
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    // 切换页数
    changeTablePage(
      page = this.pagination.current,
      row = this.pagination.size
    ) {
      console.log(page, row);
      this.pagination.records = [...this.tableDataAll].slice(
        (page - 1) * row,
        page * row
      );
    },
    /**
     * row 要插入的数据
     * tableName
     * text 成功后的message
     */
    async insertRow(row, tableName, text) {
      console.log(row, tableName, text);
      that.$store.commit("setIsLoding", true);
      let isCanInsert = await that.$DBChain.canInsertRow(
        that.appCode,
        tableName,
        row
      );
      console.log(isCanInsert);
      if (!isCanInsert) {
        that.$store.commit("setIsLoding", false);
        return that.$message.error("暂时不能插入，请检查原因");
      }
      // 能进回调的都是成功提交了。
      that.$DBChain.insertRow(that.appCode, tableName, row, async () => {
        // own 便捷查询，查询自己的数据
        that.$store.commit("setIsLoding", false);
        that.$message.success(text);
        that.getStudentInfo();
        // that.form={}
      });
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
