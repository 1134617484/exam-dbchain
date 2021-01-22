<template>
  <section class="index">
    <div class="hello">
      <i class="iconfont icon-xihuan"></i><span>很高兴遇见你,{{user.userName}}老师。</span>
    </div>
    <div class="msg">
      <p class="title">教务公告：</p>
      <ul>
        <li @click="openMsg()"><i class="iconfont icon-flag"></i>清明节放假通知</li>
        <li @click="openMsg()"><i class="iconfont icon-flag"></i>下周例行工作报告会</li>
        <li @click="openMsg()"><i class="iconfont icon-flag"></i>关于毕业生答辩具体流程</li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      user: { //用户信息
        userName: null,
        userId: null
      } 
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      let address = this.$DBChain.getAddress();
      console.log(address);
      // 多条件查询 查询当前且可用的学生，若多个学生符合，则取最后一条，
      //基于区块链特性，数据不可删除，故，若该生冻结解冻多次，或该系统中并未设计去重，因此可能会产生符合条件的多条数据
      let user = await this.$DBChain
        .Querier(this.appCode)
        .student.compareAll([
          ["address", address],
          ["status", "1"],
        ])
        .val();

      user.reverse();
      console.log(user);
      if (!user[0]) return this.$message.error("暂未找到该学生，请联系其老师");
      this.userInfo = user[0];
    },
    openMsg() {
      this.$alert('根据《国务院办公厅关于2019年部分节假日安排的通知》精神，越城区行政服务中心将于4月5日（星期五）至4月7日（星期天）进行清明节放假调休，共3天，放假期间不受理业务。4月8日（星期一）开始正常上班受理业务。望市民朋友相互转告，给您带来不便，敬请谅解。','清明节放假通知',{
        confirmButtonText: '确定'
      })
    }
  },
   computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
    isPractice() {
      return this.$store.getters.getIsPractice;
    },
  },
}
</script>


<style lang="scss" scoped>
.index {
  margin-left: 70px;
  .hello {
    font-size: 20px;
    color: #726f70;
    .icon-xihuan {
      font-size: 30px;
      color: #dd6572;
    }
  }
  .msg {
    .title {
      font-size: 16px;
      color: #000;
      margin-top: 20px;
      margin-left: 10px;
    }
    ul {
      display: flex;
      flex-direction: column;
      width: 200px;
      overflow: hidden;
    }
    li {
      margin-top: 10px;
      font-size: 14px;
      color: lightcoral;
      cursor: pointer;
      display: inline-block;
    }
  }
}
</style>

