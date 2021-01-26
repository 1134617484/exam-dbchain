//查询所有考试
<template>
  <div class="exam">
    <el-table :data="pagination.records" border>
      <el-table-column
        fixed="left"
        prop="source"
        label="试卷名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="介绍"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="institute"
        label="所属学院"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="major"
        label="所属专业"
        width="200"
      ></el-table-column>
      <el-table-column prop="grade" label="年级" width="100"></el-table-column>
      <el-table-column
        prop="term"
        label="学期或班级"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="exam_date"
        label="考试日期"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="total_time"
        label="持续时间"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="total_soure"
        label="总分"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="试卷类型"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="tips"
        label="考生提示"
        width="400"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" size="small"
            >编辑</el-button
          >
          <el-button @click="deleteRecord(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[4, 8, 10, 20]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      class="page"
    >
    </el-pagination>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑试卷信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="试卷名称">
            <el-input v-model="form.source"></el-input>
          </el-form-item>
          <el-form-item label="介绍">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="所属学院">
            <el-input v-model="form.institute"></el-input>
          </el-form-item>
          <el-form-item label="所属专业">
            <el-input v-model="form.major"></el-input>
          </el-form-item>
          <el-form-item label="年级">
            <el-input v-model="form.grade"></el-input>
          </el-form-item>
          <el-form-item label="学期或班级">
            <el-input v-model="form.term"></el-input>
          </el-form-item>
          <el-form-item label="考试日期">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.exam_date"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="持续时间">
            <el-input v-model="form.total_time"></el-input>
          </el-form-item>
          <el-form-item label="总分">
            <el-input v-model="form.total_soure"></el-input>
          </el-form-item>
          <el-form-item label="试卷类型">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
          <el-form-item label="考生提示">
            <el-input type="textarea" v-model="form.tips"></el-input>
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
import { Querier } from "dbchain-js-client";
import { ArrdeWeight } from "@/utils/mUtils";
import {mapState} from 'vuex';
export default {
  data() {
    return {
      form: {}, //保存点击以后当前试卷的信息
      pagination: {
        //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 4, //每页条数
      },
      dialogVisible: false,
    };
  },
  created() {
    console.log(this);
    this.getExamInfo();
  },
  methods: {
    edit(row) {
      //编辑试卷

      this.dialogVisible = true;
      this.form = row;
      // this.$axios(`${this.API}/api/exam/${examCode}`).then(res => { //根据试卷id请求后台
      //   if(res.data.code == 200) {
      //     this.form = res.data.data
      //   }
      // })
    },
    handleClose(done) {
      //关闭提醒
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    submit() {
      //提交修改后的试卷信息
      this.dialogVisible = false;
      this.$store.commit("setIsLoding", true);
      this.insertRow(this.form, "恭喜您，修改操作已提交");
    },
    deleteRecord(row) {
      // 区块链中无删除的概念，因为上链的数据不可删除，故，此处删除等同于冻结，即，
      //插入一条同样的数据并将状态设为0，使用时取所有状态不为0的数据
      let data = {
        description: row.description,
        exam_date: row.exam_date,
        grade: row.grade,
        institute: row.institute,
        major: row.major,
        paper_id: row.paper_id,
        source: row.source,
        status: "0",
        term: row.term,
        tips: row.tips,
        total_soure: row.total_soure,
        total_time: row.total_time,
        type: row.type,
      };

      this.$confirm("确定删除该记录吗,该操作不可逆！！！", "删除提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "算了,留着",
        type: "danger",
      })
        .then(() => {
          //确认删除
          console.log(row);
          console.log(data);
          this.$store.commit("setIsLoding", true);
          this.insertRow(data, "恭喜您，删除操作已提交");
        })
        .catch(() => {});
    },
    /**
     * row 要插入的数据
     * text 成功后的message
     */
    async insertRow(row, text) {
      console.log(row);
      let isCanInsert = await this.$DBChain.canInsertRow(
        this.appCode,
        "exam_manage",
        row
      );
      console.log(isCanInsert);
      if (!isCanInsert) return this.$message.error("暂时不能插入，请检查原因");
      // 能进回调的都是成功提交了。
      this.$DBChain.insertRow(this.appCode, "exam_manage", row, () => {
        this.$store.commit("setIsLoding", false);
        this.$message.success(text);
        this.getExamInfo();
      });
    },
    async getExamInfo() {
      //分页查询所有试卷信息
      // compareAll方法可设置多个查询条件，会返回都符合的数据  反转是为了倒序，以使数据最新的在前面
      // 此页面用单独引入的方法做示例以便大家更容易的理解它
      console.log(this.appCode);
      // 先获取当前用户的地址
      let data=[];
      let address = this.$DBChain.getAddress();
      if(this.userType=='0'){
data = await Querier(this.appCode)
        ["exam_manage"].val();
      }else{
        data = await Querier(this.appCode)
        ["exam_manage"].compareAll([["created_by", address]])
        .val();
      }
      
      console.log([...data]);
      data.reverse();
      data = ArrdeWeight(data, "paper_id");
      console.log([...data]);
      data = data.filter((res) => {
        return res.status !== "0" && res.paper_id;
      });
      console.log([...data]);

      console.log(data);
      this.pagination.records = data;
      this.$forceUpdate();
     
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getExamInfo();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getExamInfo();
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
}
</style>
