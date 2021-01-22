<!-- 顶部信息栏 -->
<template>
  <header id="topbar">
    <el-row>
      <el-col :span="4" class="topbar-left">
        <i class="iconfont icon-kaoshi"></i>
        <span class="title" @click="index()">EXAM-SYSTEM</span>
      </el-col>
      <el-col :span="20" class="topbar-right">
        <i class="el-icon-menu" @click="toggle()"></i>
        <div class="user">
          <span>{{ userType=='0'?user.admin_name:userType=='1'?user.teacher_name:user.student_name }}</span>
          <img
            src="@/assets/img/userimg.png"
            class="user-img"
            ref="img"
            @click="showSetting()"
          />
          <transition name="fade">
            <div class="out" ref="out" v-show="login_flag">
              <ul>
                <li><a href="javascript:;">用户信息</a></li>
                <li><a href="javascript:;">设置</a></li>
                <li class="exit" @click="exit()">
                  <a href="javascript:;">退出登录</a>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </el-col>
    </el-row>
  </header>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      login_flag: false,
      user: {
        //用户信息
        userName: null,
        userId: null,
      },
    };
  },
  created() {
    this.getRouter();
  },
  computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
    isPractice() {
      return this.$store.getters.getIsPractice;
    },
    ...mapState(["flag", "menu", "userInfo",'userType']),
  },
  methods: {
    //显示、隐藏退出按钮
    showSetting() {
      this.login_flag = !this.login_flag;
    },
    async getRouter(address = this.$DBChain.getAddress()) {
      this.$store.commit("setIsLoding", true);
      console.log(address);
      // 先在学生表中查看
      let studentAll = await this.$DBChain
        .Querier(this.appCode)
        .student.compareAll([
          ["address", address],
          ["status", "1"],
        ])
        .val();
      console.log(studentAll);
      studentAll.reverse();
      console.log(studentAll);
      if (studentAll.length > 0) {
        this.$store.commit("setUserType", "2");
        this.$store.commit("setIsLoding", false);
        this.$store.commit("changeUserInfo", studentAll[0]);
        this.$router.push('/student')
        return (this.user = studentAll[0]);
      }
      let teacherAll = await this.$DBChain
        .Querier(this.appCode)
        .teacher.compareAll([
          ["address", address],
          ["status", "1"],
        ])
        .val();
      console.log(teacherAll);
      teacherAll.reverse();
      if (teacherAll.length > 0) {
        this.$store.commit("setUserType", "1");
        this.$store.commit("setIsLoding", false);
        this.$store.commit("changeUserInfo", teacherAll[0]);
        return (this.user = teacherAll[0]);
      }
      let adminAll = await this.$DBChain
        .Querier(this.appCode)
        .admin.compareAll([
          ["address", address],
          ["status", "1"],
        ])
        .val();
      console.log(adminAll);
      adminAll.reverse();
      if (adminAll.length > 0) {
        this.$store.commit("setUserType", "0");
        this.$store.commit("setIsLoding", false);
        this.$store.commit("changeUserInfo", adminAll[0]);
        return (this.user = adminAll[0]);
      }
    },
    //左侧栏放大缩小
    ...mapMutations(["toggle"]),

    index() {
      this.$router.push({ path: "/index" });
    },
    exit() {
      this.$router.push({ path: "/login" }); //跳转到登录页面
      if (role == 0) {
        this.menu.pop();
      }
    },
  },
  store,
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#topbar {
  position: relative;
  z-index: 10;
  background-color: #124280;
  height: 80px;
  line-height: 80px;
  color: #fff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.5);
}
#topbar .topbar-left {
  height: 80px;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.topbar-left .icon-kaoshi {
  font-size: 60px;
}
.topbar-left .title {
  font-size: 20px;
  cursor: pointer;
}
.topbar-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topbar-right .user-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.topbar-right .el-icon-menu {
  font-size: 30px;
  margin-left: 20px;
}
.topbar-right .user {
  position: relative;
  margin-right: 40px;
  display: flex;
}
.topbar-right .user .user-img {
  margin-top: 15px;
  margin-left: 10px;
  cursor: pointer;
}
.user .out {
  font-size: 14px;
  position: absolute;
  top: 80px;
  right: 0px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 12px;
}
.user .out ul {
  list-style: none;
}
.user .out ul > li {
  height: 26px;
  line-height: 26px;
}
.out a {
  text-decoration: none;
  color: #000;
}
.out .exit {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #ccc;
}
</style>
