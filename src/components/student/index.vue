<!--学生考试首页-->
<template>
  <div id="student">
    <el-row class="padding-50">
      <el-col :span="24">
        <ul class="list">
          <li class="logo"><i class="iconfont icon-kaoshi"></i><span>Exam-Online</span></li>
          <li @click="exam()"><a href="javascript:;" >我的试卷</a></li>
          <li @click="practice()"><a href="javascript:;">我的练习</a></li>
          <li><router-link to="/scoreTable">我的分数</router-link></li>
          <li><router-link to="/message">给我留言</router-link></li>
          <li><a href="javascript:;">待定</a></li>
          <li class="right" @mouseenter="flag = !flag" @mouseleave="flag = !flag">
            <a href="javascript:;"><i class="iconfont icon-Userselect icon"></i>{{userInfo.student_name}}</a>
            <div class="msg" v-if="flag">
              <p @click="manage()">管理中心</p>
              <p class="exit" @click="exit()">退出</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!--路由区域-->
    <div class="main">
      <router-view></router-view>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import myFooter from "@/components/student/myFooter"
import store from '@/vuex/store'
import {mapState} from 'vuex'
export default {
  store,
  components: {
    "v-footer": myFooter
  },
  data() {
    return {
      flag: false,
      userInfo: {}
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    exit() {  //退出登录
      this.$router.push({path:"/login"}) //跳转到登录页面
     
    },
    manage() {  //跳转到修改密码页面
      this.$router.push({path: '/manager'})
    },
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
    practice() { //跳转练习模式
      let isPractice = true
      this.$store.commit("practice", isPractice)
      this.$router.push({path:'/startExam'})
    },
    exam() { //跳转考试模式
     let isPractice = false
      this.$store.commit("practice", isPractice)
      this.$router.push({path:'/student'})
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

<style scoped>
.right .icon {
  margin-right: 6px;
}
#student .padding-50 {
  margin: 0 auto;
  padding: 0 50px;
  box-shadow: 0 0 10px 4px rgba(1,149,255,0.1);
  background-color: #fff;
}
.list a {
  text-decoration: none;
  color: #334046;
}
li {
  list-style: none;
  height: 60px;
  line-height: 60px;
}
#student .list{
  display: flex;
}
#student .list li {
  padding: 0 20px;
  cursor: pointer;
}
#student .list li:hover {
  background-color: #0195ff;
  transition: all 2s ease;
}
#student .list li:hover a {
  color: #fff;
}
#student .list .right {
  margin-left: auto;
  position: relative;
}
#student .list li.right :hover a {
  color: #000;
}
#student .list .logo {
  display: flex;
  font-weight: bold;
  color: #2f6c9f;
}
#student .list .logo i {
  font-size: 50px;
}
.right .msg {
  text-align: center;
  position: absolute;
  top: 60px;
  left: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border-bottom: 3px solid #0195ff;
  background-color: #fff;
}
.right .msg p {
  height: 40px;
  line-height: 40px;
  width: 105px;
}
.right .msg p:hover {
  background-color: #0195ff;
}
</style>
