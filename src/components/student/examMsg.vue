// 点击试卷后的缩略信息
<template>
  <div id="msg">
    <div class="title">
      <span>试卷列表</span>
      <span>/ {{ examData.source }}</span>
    </div>
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{ examData.source }}</li>
        <li><i class="iconfont icon-pen-"></i></li>
        <li><i class="iconfont icon-share"></i></li>
        <li class="right">
          <div>
            <span class="count">总分</span>
            <span class="score">{{ score[0] + score[1] + score[2] }}</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>更新于{{ examData.exam_date }}</li>
        <li>来自 {{ examData.institute }}</li>
        <li class="btn">{{ examData.type }}</li>
        <li class="right">
          <el-button @click="toAnswer(examData)">开始答题</el-button>
        </li>
      </ul>
      <ul class="info">
        <li @click="dialogVisible = true">
          <a href="javascript:;"><i class="iconfont icon-info"></i>考生须知</a>
        </li>
      </ul>
    </div>
    <div class="content">
      <el-collapse v-model="activeName">
        <el-collapse-item class="header" name="0">
          <template slot="title" class="stitle">
            <div class="title">
              <span>{{ examData.source }}</span
              ><i class="header-icon el-icon-info"></i>
              <span class="time"
                >{{ examData.total_soure }}分 /
                {{ examData.total_time }}分钟</span
              >
              <el-button type="primary" size="small"
                >点击查看试题详情</el-button
              >
            </div>
          </template>
          <el-collapse class="inner">
            <el-collapse-item>
              <template slot="title" name="1">
                <div class="titlei">
                  选择题 (共{{ topicCount[0] }}题 共计{{ score[0] }}分)
                </div>
              </template>
              <div class="contenti">
                <ul
                  class="question"
                  v-for="(list, index) in topic['multi_question']"
                  :key="index"
                >
                  <li>
                    {{ index + 1 }}. {{ list.question }} {{ list.score }}分
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="2">
                <div class="titlei">
                  填空题 (共{{ topicCount[1] }}题 共计{{ score[1] }}分)
                </div>
              </template>
              <div class="contenti">
                <ul
                  class="question"
                  v-for="(list, index) in topic['fill_question']"
                  :key="index"
                >
                  <li>
                    {{ topicCount[0] + index + 1 }}.{{ list.question }}
                    {{ list.score }}分
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="3">
                <div class="titlei">
                  判断题 (共{{ topicCount[2] }}题 共计{{ score[2] }}分)
                </div>
              </template>
              <div class="contenti">
                <ul
                  class="question"
                  v-for="(list, index) in topic['judge_question']"
                  :key="index"
                >
                  <li>
                    {{ topicCount[0] + topicCount[1] + index + 1 }}.
                    {{ list.question }} {{ list.score }}分
                  </li>
                </ul>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--考生须知对话框-->
    <el-dialog title="考生须知" :visible.sync="dialogVisible" width="30%">
      <span>{{ examData.tips }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, //对话框属性
      activeName: "0", //默认打开序号
      topicCount: [0, 0, 0], //每种类型题目的总数
      score: [0, 0, 0], //每种类型分数的总数
      examData: {
        //考试信息
        // source: null,
        // totalScore: null,
      },
      topic: {
        //试卷信息
        judge_question: [],
        fill_question: [],
        multi_question: [],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    //初始化页面数据
    async init() {
      let paper_id = this.$route.query.paper_id; //获取路由传递过来的试卷编号
      console.log(paper_id);
      // 获取试题最基本信息 若有雷同，取最后一条
      let examDataAll = await this.$DBChain
        .Querier(this.appCode)
        .exam_manage.equal("paper_id", paper_id)
        .val();
      examDataAll.reverse();
      this.examData = examDataAll[0];
      console.log(examDataAll);

      let paperManageAll = await this.$DBChain
        .Querier(this.appCode)
        .paper_manage.equal("paper_id", paper_id)
        .val();
      console.log(paperManageAll);

      // 查询处理试题
      const setQuestion = async (type, element,i) => {
        if (!(type == "1" || type == "2" || type == "3")) return false;
        console.log(type, element);
        let name =
          type == "1"
            ? "multi_question"
            : type == "2"
            ? "fill_question"
            : "judge_question";
        let question = await this.$DBChain
          .Querier(this.appCode)
          [name].equal("id", element.question_id)
          .val();
        console.log(question);
        question.reverse();
        // 分别获取每种题型并赋值
        this.topic[name] ? "" : (this.topic[name] = []);
        console.log(this.topic[name]);
        this.topic[name][this.topic[name].length] = question[0];
        console.log(this.topic[name]);
        this.topicCount[Number(type) - 1]++;
        this.score[Number(type) - 1] += Number(question[0].score);

        if (i == paperManageAll.length - 1) {
          console.log(this.topic, this.topicCount);
          this.$forceUpdate();
        }
      };

      for (let i = 0; i < paperManageAll.length; i++) {
        let element = paperManageAll[i];
        if (element.question_type == "1") {
          setQuestion("1", element,i);
          // 选择  multi_question
        }
        if (element.question_type == "2") {
          setQuestion("2", element,i);
        }
        if (element.question_type == "3") {
          setQuestion("3", element,i);
        }
      }
    },
    toAnswer(examCode) {
      let paper_id = this.$route.query.paper_id; //获取路由传递过来的试卷编号
      console.log(paper_id);
      this.$router.push({ path: "/answer", query: { paper_id: paper_id } });
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
.bottom {
  .right {
    .el-button {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
}
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 980px;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
</style>
