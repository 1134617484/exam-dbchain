<!-- 添加教师 -->
<template>
  <section class="add">
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
      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
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
      <el-form-item label="库链地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
let that;
export default {
  data() {
    return {
      form: {
        //表单数据初始化
        teacher_name: null,//教师名字
        institute: null,//学院
        tel: null,//电话  
        email: null,//邮箱
        pwd: null,//密码
        card_id: null,//身份证号
        sex: null,//性别
        role: "1",//角色
        address:"",//库链地址
        type:'',//职称
      },
    };
  },
  methods: {
    onSubmit() {
      console.log(this.form,this)
      let data={...this.form,...{status:"1"}};
      console.log(data)
       this.insertRow(data, "teacher", "教师添加成功");
      //数据提交
      // this.$axios({
      //   url: "/api/teacher",
      //   method: "post",
      //   data: {
      //     ...this.form,
      //   },
      // }).then((res) => {
      //   if (res.data.code == 200) {
      //     this.$message({
      //       message: "数据添加成功",
      //       type: "success",
      //     });
      //     this.$router.push({ path: "/teacherManage" });
      //   }
      // });
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

            that.$store.commit("setIsLoding", false);
            that.$message.success(text);
            that.$router.push('/teacherManage')
          // that.form={}  
      });
    },
    cancel() {
      //取消按钮
      this.form = {};
    },
  },
  created(){
    that=this;
  },
  computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
  },
};
</script>
<style lang="scss" scoped>
.add {
  padding: 0px 40px;
  width: 400px;
}
</style>

