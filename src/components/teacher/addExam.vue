<!-- 添加考试 -->
<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="试卷编号">
        <el-input v-model="form.paper_id"></el-input>
      </el-form-item>
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
          <el-date-picker placeholder="选择日期" v-model="form.exam_date" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="持续时间">
        <el-input v-model="form.total_time"></el-input>
      </el-form-item>
      <el-form-item label="总分">
        <el-input v-model="form.total_soure"></el-input>
      </el-form-item>
      <el-form-item label="考试类型">
        <el-input v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="考生提示">
        <el-input type="textarea" v-model="form.tips"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: { //表单数据初始化
        source: "马克思主义年度考核",
        description: "马克思主义年度考核，，，，，",
        institute: "马克思大学",
        major: "马克思主义",
        grade: "一班",
        term:'上学期',
        exam_date: new Date(`Fri Jan 15 2021 00:00:00 GMT+0800 (新加坡标准时间)`),
        total_time: "150",
        total_soure: "150",
        type: "年度考试",
        tips: "快乐千万条，学习第一条，平时不努力，考试两行泪。",
        paper_id:"1003"
      }
    };
  },
  methods: {
    formatTime(date) { //日期格式化
      let year = date.getFullYear()
      let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    async onSubmit() {
      this.$store.commit('setIsLoding', true);
      let data=this.form;
      console.log(data);
      let exam_date = this.formatTime(data.exam_date)
      data.exam_date = exam_date.substr(0,10)
      console.log(data);
      console.log(this)
      // 不存在跨域问题，若提示跨域，则检查baseUrl chainId AppCode 表名，表内字段名等是否正确
      // 插入数据之前，调用dbchain-js-client提供的方法先判断数据是否可正常插入。若为否，则应终止您的
      //操作并检查原因，以避免出现不可预料的错误
      console.log(this.appCode,'exam_manage',data)
      let isCanInsert=await this.$DBChain.canInsertRow(this.appCode,'exam_manage',data)
      console.log(isCanInsert)
      if(!isCanInsert)return this.$message.error('暂时不能插入，请检查原因');
      // 能进回调的都是成功提交了。
      this.$DBChain.insertRow(this.appCode,'exam_manage',this.form, ()=>{
        this.$store.commit('setIsLoding', false);
        this.$message.success('添加试题成功')
        this.$router.push({path: '/selectExam'})
      })

    },
    cancel() { //取消按钮
      this.form = {}
    },
    
  },
  computed:{
    appCode(){
      return this.$APIURL.AppCode
    }
  }
};
</script>
<style lang="scss" scoped>
.add {
  padding: 0px 40px;
  width: 400px;
}
</style>

