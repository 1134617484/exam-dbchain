<!-- 添加学生 -->
<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.student_name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.sex"></el-input>
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="form.institute"></el-input>
      </el-form-item>
      <el-form-item label="所属专业">
        <el-input v-model="form.major"></el-input>
      </el-form-item>
      <el-form-item label="年级">
        <el-input v-model="form.grade"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.clazz"></el-input>
      </el-form-item>
      <el-form-item label="老师">
        <el-select
          v-model="form.teacher_id"
          placeholder="请指派老师"
          class="w150"
        >
          <el-option
            v-for="item in teacherAll"
            :key="item.id"
            :label="item.teacher_name+':'+item.address"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- <el-input v-model="form.clazz"></el-input> -->
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.card_id"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.pwd"></el-input>
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
      teacherAll: [],
      form: {
        //表单数据初始化
//         address: "cosmos15za2ksxwvh9jwhsh0rep2965fkc755epz5xfer",
// card_id: "036e227ba9ea5f210bbd8cdf2512a01cf135a37b4332474727f04bee1b8b58506b",
// clazz: "2班",
// email: "fuel lamp canal lazy barrel medal scheme coconut brass slender tackle satoshi",
// grade: "2025级",
// institute: "罗斯福大学",
// major: "罗斯福新政",
// pwd: "464454a",
// role: "2",
// sex: "男",
// student_name: "学生甲",
// teacher_id: "2",
// tel: "13100000000",
        student_name: null,
        grade: null,
        major: null,
        clazz: null,
        institute: null,
        tel: null,
        email: null,
        pwd: null,
        card_id: null,
        sex: null,
        role: "2",
        address:null,
        teacher_id:null
      },
    };
  },
  methods: {
    onSubmit() {
      //数据提交  
      console.log(this.form)
      let data={...this.form,...{status:"1"}};
      console.log(data)
       this.insertRow(data, "student", "学生添加成功");
      // this.$axios({
      //   url: '/api/student',
      //   method: 'post',
      //   data: {
      //     ...this.form
      //   }
      // }).then(res => {
      //   if(res.data.code == 200) {
      //     this.$message({
      //       message: '数据添加成功',
      //       type: 'success'
      //     })
      //     this.$router.push({path: '/studentManage'})
      //   }
      // })
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
        // 因区块链特性，暂无法做到如传统互联网返回刚插入的数据id，只能查刚插入的表，取到‘我’插入的最后一条数据
        // own 便捷查询，查询自己的数据
            that.$store.commit("setIsLoding", false);
            that.$message.success(text);
            that.$router.push('/studentManage')
          // that.form={}  
      });
    },
    cancel() {
      //取消按钮
      this.form = {};
    },
    // 获取所有老师
    async getTeacherAll() {
      let teacherAll = await this.$DBChain
        .Querier(this.appCode)
        ["teacher"].val();
        // 过滤垃圾数据 无address的
      console.log(teacherAll);
      teacherAll=teacherAll.filter(res=>{
        return res.address
      })
      console.log(teacherAll);
      this.teacherAll=teacherAll;
    },
  },
  created(){
    that=this;
    this.getTeacherAll()
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

