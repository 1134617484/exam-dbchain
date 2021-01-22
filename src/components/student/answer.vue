<!--考生答题界面-->
<template>
  <div id="answer">
    <!--顶部信息栏-->
    <div class="top">
      <ul class="item">
        <li>
          <i
            class="iconfont icon-menufold icon20"
            ref="toggle"
            @click="slider_flag = !slider_flag"
          ></i>
        </li>
        <li>{{ examData.type }}-{{ examData.source }}</li>
        <li @click="flag = !flag">
          <i class="iconfont icon-user icon20"></i>
          <div class="msg" v-if="flag" @click="flag = !flag">
            <p>姓名：{{ userInfo.name }}</p>
            <p>准考证号: {{ userInfo.id }}</p>
          </div>
        </li>
        <li><i class="iconfont icon-arrLeft icon20"></i></li>
      </ul>
    </div>
    <div class="flexarea">
      <!--左边题目编号区-->
      <transition name="slider-fade">
        <div class="left" v-if="slider_flag">
          <ul class="l-top">
            <li>
              <a href="javascript:;"></a>
              <span>当前</span>
            </li>
            <li>
              <a href="javascript:;"></a>
              <span>未答</span>
            </li>
            <li>
              <a href="javascript:;"></a>
              <span>已答</span>
            </li>
            <li>
              <a href="javascript:;"></a>
              <span>标记</span>
            </li>
          </ul>
          <div class="l-bottom">
            <div class="item">
              <p>选择题部分</p>
              <ul>
                <li
                  v-for="(list, index1) in topic['multi_question']"
                  :key="index1"
                >
                  <a
                    href="javascript:;"
                    @click="getShowAnswer(1, index1)"
                    :class="{
                      border: index == index1 && currentType == 1,
                      bg: AnswerAll['multi_question'][index1],
                    }"
                  >
                    <span
                      :class="{
                        mark: topic['multi_question'][index1].isMark == true,
                      }"
                    ></span>
                    {{ index1 + 1 }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="item">
              <p>填空题部分</p>
              <ul>
                <li
                  v-for="(list, index2) in topic['fill_question']"
                  :key="index2"
                >
                  <a
                    href="javascript:;"
                    @click="getShowAnswer(2, index2)"
                    :class="{
                      border: index == index2 && currentType == 2,
                      bg: AnswerAll['fill_question'][index2],
                    }"
                    ><span
                      :class="{
                        mark: topic['fill_question'][index2].isMark == true,
                      }"
                    ></span
                    >{{ topicCount[0] + index2 + 1 }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="item">
              <p>判断题部分</p>
              <ul>
                <li
                  v-for="(list, index3) in topic['judge_question']"
                  :key="index3"
                >
                  <a
                    href="javascript:;"
                    @click="getShowAnswer(3, index3)"
                    :class="{
                      border: index == index3 && currentType == 3,
                      bg: AnswerAll['judge_question'][index3],
                    }"
                    ><span
                      :class="{
                        mark: topic['judge_question'][index3].isMark == true,
                      }"
                    ></span
                    >{{ topicCount[0] + topicCount[1] + index3 + 1 }}</a
                  >
                </li>
              </ul>
            </div>
            <div class="final" @click="commit()">结束考试</div>
          </div>
        </div>
      </transition>
      <!--右边选择答题区-->
      <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{ title }}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span
              >全卷共{{ topicCount[0] + topicCount[1] + topicCount[2] }}题
              <i class="iconfont icon-time"></i>倒计时：<b>{{ time }}</b
              >分钟</span
            >
          </div>
          <div class="content">
            <p class="topic">
              <span class="number">{{ number }}</span
              >{{ showQuestion }}
            </p>
            <div v-if="currentType == 1">
              <el-radio-group v-model="AnswerAll['multi_question'][index]">
                <el-radio :label="1">{{ showAnswer.answer_a }}</el-radio>
                <el-radio :label="2">{{ showAnswer.answer_b }}</el-radio>
                <el-radio :label="3">{{ showAnswer.answer_c }}</el-radio>
                <el-radio :label="4">{{ showAnswer.answer_d }}</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li>
                    <el-tag type="success">正确姿势：</el-tag
                    ><span class="right">{{ topic["multi_question"][index].right_answer }}</span>
                  </li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>
                    {{
                      topic["multi_question"][index].question == null
                        ? "暂无解析"
                        : topic["multi_question"][index].question
                    }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="fill" v-if="currentType == 2">
              <div
                v-for="(item, currentIndex) in getPart()"
                :key="currentIndex"
              >
                <el-input
                  placeholder="请填在此处"
                  v-model="AnswerAll['fill_question'][index]"
                  clearable
                >
                </el-input>
              </div>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li>
                    <el-tag type="success">正确姿势：</el-tag
                    ><span class="right">{{
                      topic["fill_question"][index].answer
                    }}</span>
                  </li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>
                    {{
                      topic["fill_question"][index].question == null
                        ? "暂无解析"
                        : topic["fill_question"][index].question
                    }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="judge" v-if="currentType == 3">
              <el-radio-group v-model="AnswerAll['judge_question'][index]">
                <el-radio :label="1">正确</el-radio>
                <el-radio :label="2">错误</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li>
                    <el-tag type="success">正确姿势：</el-tag
                    ><span class="right">{{
                      topic["judge_question"][index].answer
                    }}</span>
                  </li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>
                    {{
                      topic["judge_question"][index].question == null
                        ? "暂无解析"
                        : topic["judge_question"][index].question
                    }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="operation">
            <ul class="end">
              <li
                @click="previous()"
                v-show="!(currentType == 1 && index == 0)"
              >
                <i class="iconfont icon-previous"></i><span>上一题</span>
              </li>
              <li @click="mark()">
                <i class="iconfont icon-mark-o"></i><span>标记</span>
              </li>
              <li
                @click="next()"
                v-show="
                  !(
                    currentType == Object.keys(topic).length &&
                    topic[Object.keys(topic)[currentType - 1]].length - 1 <
                      index
                  )
                "
              >
                <span>下一题 </span><i class="iconfont icon-next"></i>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
let that;
import store from "@/vuex/store";
import { mapState } from "vuex";

import {similar} from "@/utils/mUtils"
export default {
  store,
  data() {
    return {
      startTime: null, //考试开始时间
      endTime: null, //考试结束时间
      time: null, //考试持续时间
      reduceAnswer: [], //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
      answerScore: 0, //答题总分数
      bg_flag: false, //已答标识符,已答改变背景色
      isFillClick: false, //选择题是否点击标识符
      slider_flag: true, //左侧显示隐藏标识符
      flag: false, //个人信息显示隐藏标识符
      currentType: 1, //当前题型类型  1--选择题  2--填空题  3--判断题
      radio: [], //保存考生所有选择题的选项
      title: "请选择正确的选项",
      index: 0, //全局index
      userInfo: {
        //用户信息
        name: null,
        id: null,
      },
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
      showQuestion: [], //当前显示题目信息
      showAnswer: {}, //当前题目对应的答案选项
      number: 1, //题号
      part: null, //填空题的空格数量
      fillAnswer: [[]], //二维数组保存所有填空题答案
      judgeAnswer: [], //保存所有判断题答案
      topic1Answer: [], //学生选择题作答编号,
      rightAnswer: "",

      AnswerAll: {
        //所有用户答案
        judge_question: [],
        fill_question: [],
        multi_question: [],
      },
      multiAnswerMap:['A','B','C','D'],
judgeAnswerMap:['T','F'],
    };
  },
  created() {
    that=this;
    this.getUserInfo();
    this.getExamData();
    this.showTime();
  },
  methods: {
    getTime(date) {
      //日期格式化
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
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
    calcuScore() {
      //计算答题分数
    },
    async getExamData() {
      //获取当前试卷所有信息
      let date = new Date();
      this.startTime = this.getTime(date);
      let paper_id = this.$route.query.paper_id; //获取路由传递过来的试卷编号
      console.log(paper_id);
      // 获取试题最基本信息 若有雷同，取最后一条
      let examDataAll = await this.$DBChain
        .Querier(this.appCode)
        .exam_manage.equal("paper_id", paper_id)
        .val();
      examDataAll.reverse();
      this.examData = examDataAll[0];
      this.index = 0;
      this.time = this.examData.total_soure;
      console.log(examDataAll);
      // 获取试卷
      let paperManageAll = await this.$DBChain
        .Querier(this.appCode)
        .paper_manage.equal("paper_id", paper_id)
        .val();
      console.log(paperManageAll);

      // 处理试题
      const setQuestion = async (type, element, i) => {
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
        this.AnswerAll[name][this.AnswerAll[name].length] =
          type == "3" ? false : "";
        console.log(this.topic[name]);
        this.topicCount[Number(type) - 1]++;
        this.score[Number(type) - 1] += Number(question[0].score);

        if (i == paperManageAll.length - 1) {
          console.log(this.topic, this.topicCount);
          //
          this.getShowAnswer();
          this.$forceUpdate();
        }
      };

      for (let i = 0; i < paperManageAll.length; i++) {
        let element = paperManageAll[i];
        if (element.question_type == "1") {
          setQuestion("1", element, i);
          // 选择  multi_question
        }
        if (element.question_type == "2") {
          setQuestion("2", element, i);
        }
        if (element.question_type == "3") {
          setQuestion("3", element, i);
        }
      }

    },
    getShowAnswer(type = this.currentType, index = this.index) {
      let name =
        type == "1"
          ? "multi_question"
          : type == "2"
          ? "fill_question"
          : "judge_question";
      console.log(type, index, name);
      console.log(name);
      this.index = index;
      this.currentType = type;
      let reduceAnswer = this.topic[name][this.index];

      this.reduceAnswer = reduceAnswer;
      let dataInit = this.topic[name];
      console.log(dataInit);
      let getNum = () => {
        if (type == "1") return index + 1;
        let num = 0;
        for (let i = 1; i < type; i++) {
          let name_x =
            i == "1"
              ? "multi_question"
              : type == "2"
              ? "fill_question"
              : "judge_question";
          console.log(name_x);
          num += this.topic[name_x].length;
          console.log(this.topic[name_x].length);
        }
        num += index + 1;
        console.log(num);
        return num;
      };
      this.number = getNum();

      this.showQuestion = dataInit[index].question;
      this.showAnswer = dataInit[index];
      console.log("顺利");
    },

    getPart(index = this.index) {
      this.showQuestion = this.topic["fill_question"][index].question; //获取题目信息
      console.log();
      let part =
        this.showQuestion.split("()").length - 1 > 0
          ? this.showQuestion.split("()").length - 1
          : 1; //根据题目中括号的数量确定填空横线数量
      this.part = part;
      this.number = this.topicCount[0] + index + 1;
      return part;
    },
    previous() {
      //上一题
      let index = this.index;
      // 当前类型最后一题
      if (index - 1 < 0) {
        if (this.currentType - 1 < 1) return false;
        this.currentType = this.currentType - 1 < 1 ? 1 : this.currentType - 1;
        let name =
          this.currentType == "1"
            ? "multi_question"
            : this.currentType == "2"
            ? "fill_question"
            : "judge_question";
        this.index = this.topic[name].length - 1;
        return this.getShowAnswer();
      }
      this.index--;
      this.getShowAnswer();
    },
    next() {
      let name =
        this.currentType == "1"
          ? "multi_question"
          : this.currentType == "2"
          ? "fill_question"
          : "judge_question";
      let index = this.index;
      console.log(name);
      if (index + 1 > this.topic[name].length - 1) {
        console.log(this.currentType, Object.keys(this.topic).length);
        if (this.currentType + 1 > Object.keys(this.topic).length) return false;
        this.index = 0;
        this.currentType += 1;
        return this.getShowAnswer();
      }
      this.index++;
      this.getShowAnswer();
    },
    mark() {
      let name =
        this.currentType == "1"
          ? "multi_question"
          : this.currentType == "2"
          ? "fill_question"
          : "judge_question";
      let ismark = !this.topic[name][this.index]["isMark"];
      this.$set(this.topic[name][this.index], "isMark", ismark);
    },

    showTime() {
      //倒计时
      setInterval(() => {
        this.time -= 1;
        if (this.time == 10) {
          this.$message({
            showClose: true,
            type: "error",
            message: "考生注意,考试时间还剩10分钟！！！",
          });
          if (this.time == 0) {
            console.log("考试时间已到,强制交卷。");
          }
        }
      }, 1000 * 60);
    },
    commit() {
      let isCommit = true;
      let data = {
        exam_code: this.examData.id,
        student_id: this.userInfo.id,
        subject: this.examData.source,
        score: "",
      };
let score=0;
console.log(Object.keys(this.AnswerAll))
      for (let i = 0; i < Object.keys(this.AnswerAll).length; i++) {
        let name = Object.keys(this.AnswerAll)[i];
        console.log(name)
        let el = this.AnswerAll[name];
        console.log(el)
        for (let j = 0; j < el.length; j++) {
          // 判断是否有空题
          if(!el[j]){
            isCommit = false;
            continue
          }
          let userAnswer;//用户答案，需根据题型转换
          
          // 判断题取映射，与正确答案比对的值
          if(name=='judge_question'){
              userAnswer=this.judgeAnswerMap[el[j]-1];
              console.log(userAnswer)
      if(userAnswer==this.topic[name][j].answer)score+=Number(this.topic[name][j].score)
              continue
          }
          // 选择题
          if(name=='multi_question'){
            
              userAnswer=this.multiAnswerMap[el[j]-1];
              console.log(userAnswer)
              // 答对加分
      if(userAnswer==this.topic[name][j].right_answer)score+=Number(this.topic[name][j].score)
              continue
          }
          // 填空题
          if(name=='fill_question'){
            console.log(el[j],this.topic[name][j].answer)
            let isSimil=similar(el[j],this.topic[name][j].answer);
            if(Number(isSimil)>0.6)score+=Number(this.topic[name][j].score)
          }

          // 

        }
      }
      console.log(score)
      this.isPractice?data.pt_score=score+'':data.score=score+'';
      if(this.isPractice){
         this.$message.error(`您的得分是${score},练习模式不必提交`)
        return this.$router.push('/student')
      }
      if (!isCommit) {
        this.$confirm("您还有题尚未答完, 是否提交?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
           return this.insertRow(data,'score','学生成绩提交成功')

          })
          .catch(() => {
            
          });
      }else{
     return  this.insertRow(data,'score','学生成绩提交成功')
      }
    },

    /**
     * row 要插入的数据
     * tableName
     * text 成功后的message
     */
    async insertRow(row, tableName, text) {
      console.log(row, tableName, text);
      console.log(that)
      that.$store.commit("setIsLoding", true);
      console.log(that.appCode,
        tableName,
        row)
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
            that.$router.push('/student')
          // that.form={}  
      });
    },
  },
  computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
    ...mapState(["isPractice",'userType']),
  },
};
</script>

<style lang="scss">
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #ff90aa !important;
}
.bg {
  background-color: #5188b8 !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}
/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all 0.3s ease;
}
.slider-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slider-fade-enter,
.slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px;
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction: column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding: 0px;
  font-size: 16px;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a {
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ff90aa;
}
#answer .top {
  background-color: rgb(39, 118, 223);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>
