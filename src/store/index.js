import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isPractice: false, //练习模式标志
    flag: false, //菜单栏左右滑动标志
    userInfo: null,
    menu: [
      {
        index: "1",
        title: "考试管理",
        icon: "icon-kechengbiao",
        content: [
          { item1: "功能介绍", path: "/examDescription" },
          { item2: "考试查询", path: "selectExam" },
          { item3: "添加考试", path: "/addExam" },
        ],
      },
      {
        index: "2",
        title: "题库管理",
        icon: "icon-tiku",
        content: [
          { item1: "功能介绍", path: "/answerDescription" },
          { item2: "所有题库", path: "/selectAnswer" },
          { item3: "增加题库", path: "/addAnswer" },
          { path: "/addAnswerChildren" },
        ],
      },
      {
        index: "3",
        title: "成绩查询",
        icon: "icon-performance",
        content: [
          { item1: "学生成绩查询", path: "/allStudentsGrade" },
          { path: "/grade" },
          { item2: "成绩分段查询", path: "/selectExamToPart" },
          { path: "/scorePart" },
        ],
      },
      {
        index: "4",
        title: "学生管理",
        icon: "icon-role",
        content: [
          { item1: "学生管理", path: "/studentManage" },
          { item2: "添加学生", path: "/addStudent" },
        ],
      },
      // {
      //   index: '5',
      //   title: '教师管理',
      //   icon: 'icon-Userselect',
      //   content:[{item1:'教师管理',path:'/teacherManage'},{item2: '添加教师',path: '/addTeacher'}],
      // },
      // {
      //   index: '7',
      //   title: '模块管理',
      //   icon: 'icon-module4mokuai',
      //   content:[{item1:'模块操作',path:'/module'}],
      // }
    ],
    isLoding: false, //搜索loding
    isRouterAlive: true, //相同路由刷新组件
    userType: "2", //当前登入用户身份（0，超管；1：老师 2：学生）
  },
  getters: {
    // 查询搜索loding
    getIsLoding: (state) => state.isLoding,
    // 考试模式还是练习模式
    getIsPractice: (state) => state.isPractice,
    // 获取用户身份
    getUserType: (state) => state.userType,
  },
  mutations: {
    practice(state, status) {
      state.isPractice = status;
    },
    toggle(state) {
      state.flag = !state.flag;
    },
    changeUserInfo(state, info) {
      state.userInfo = info;
    },
    // 设置loding
    setIsLoding(state, isLoding = false) {
      state.isLoding = isLoding;
    },
    // 设置用户身份
    setUserType(state, userType = false) {
      state.userType = userType;
    },
  },
  actions: {
    getUserInfo(context, info) {
      context.commit("changeUserInfo", info);
    },
    getPractice(context, status) {
      context.commit("practice", status);
    },
    // 相同路由刷新组件
    setIsRouterAlive(context, data) {
      context.commit("setIsRouterAlive", data);
    },
    setIsLoding(context, data) {
      context.commit("setIsLoding", data);
    },
  },
  modules: {},
});
