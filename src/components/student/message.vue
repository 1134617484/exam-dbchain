// 给我留言页面
<template>
  <div id="message">
    <div class="title">给我留言</div>
    <div class="wrapper">
      <div class="title1">
        <el-input placeholder="留言标题" v-model="title" clearable> </el-input>
      </div>
      <div class="content">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="留言内容"
          v-model="content"
          clearable
        >
        </el-input>
      </div>
      <div class="btn">
        <el-button type="primary" @click="submit()">提交留言</el-button>
      </div>
      <div class="all">
        <ul class="msglist">
          <li
            class="list"
            @mouseenter="enter(index)"
            @mouseleave="leave(index)"
            v-for="(data, index) in msg"
            :key="index"
          >
            <p class="title">
              <i class="iconfont icon-untitled33"></i>{{ data.title }}
            </p>
            <p class="content">{{ data.content }}</p>
            <p class="date">
              <i class="iconfont icon-date"></i
              >{{ getFormatDate(data.created_at) }}
            </p>
            <div v-for="(replayData, index2) in data.replays" :key="index2">
              <p class="comment">
                <i class="iconfont icon-huifuxiaoxi"></i>{{ replayData.replay }}
              </p>
            </div>
            <span
              class="replay"
              @click="replay(data.id)"
              v-if="flag && index == current"
              >Comment</span
            >
          </li>
        </ul>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[4, 6, 8, 10]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
let that;
import { getFormatDate } from "@/utils/mUtils";
export default {
  // name: 'message'
  data() {
    return {
      flag: false,
      current: 0,
      title: "",
      content: "",
      pagination: {
        //分页后的留言列表
        current: 1, //当前页
        total: null, //记录条数
        size: 4, //每页条数
      },
      msg: [],
    };
  },
  created() {
    that=this;
    this.getMsg();
  },
  // watch: {

  // },
  methods: {
    async getMsg() {
      let dataAll = await this.$DBChain.Querier(this.appCode).message.val();
      console.log(dataAll);
      let replayAll = await this.$DBChain.Querier(this.appCode).replay.val();
      console.log(replayAll);

      for (let i = 0; i < dataAll.length; i++) {
        let data = [];
        let msg_id = dataAll[i].id;
        console.log(msg_id)
        for (let j = 0; j < replayAll.length; j++) {
          // data
          if (replayAll[j].message_id == msg_id) {
            console.log('ooo')
            data[data.length] = replayAll[j];
          }
        }
        dataAll[i].replays = data;
      }
      this.msg = dataAll;
      this.loading = false;
      // replays
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getMsg();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getMsg();
    },
    getFormatDate(date) {
      return getFormatDate(date);
    },

    submit() {
      let date = new Date();
      if (this.title.length == 0 || this.content.length == 0) {
        //非空判断
        this.$message({
          type: "error",
          message: "留言标题或内容不能为空",
        });
      } else {
        this.insertRow({ title: this.title,content: this.content,},'message','留言成功')
        
      }
      this.title = "";
      this.content = "";
      // this.getMsg();
    },
    replay(messageId) {
      //回复留言功能
      this.$prompt("回复留言", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "回复不能为空",
      })
        .then(({ value }) => {
          let date = new Date();
          console.log(messageId);
          this.insertRow({message_id:messageId,replay:value},'replay','回复成功')
         
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    enter(index) {
      this.flag = true;
      this.current = index;
    },
    leave(index) {
      this.flag = false;
      this.current = index;
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
          // that.form={}  
          that.getMsg();
      });
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
.pagination {
  display: flex;
  justify-content: center;
}
#message {
  width: 980px;
  margin: 0 auto;
}
.title {
  margin: 20px;
}
.content {
  padding: 20px 0px;
}
#message {
  .btn {
    padding-bottom: 20px;
  }
  .all {
    .date {
      color: rgb(80, 157, 202);
      line-height: 45px;
      font-size: 13px;
    }
    .list {
      background-color: #eee;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0px;
      position: relative;
      transition: all 0.3s ease;
      .title {
        color: #5f5f5f;
        margin: 0px;
        font-size: 13px;
        line-height: 30px;
      }
      .content {
        padding: 0px;
      }
      .icon-untitled33 {
        font-size: 13px;
        margin-right: 4px;
      }
      .icon-date {
        font-size: 13px;
        margin-right: 4px;
        color: rgb(80, 157, 202);
      }
      .replay {
        position: absolute;
        right: 30px;
        bottom: 15px;
        color: tomato;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .comment {
        margin: -7px 0px;
        padding-bottom: 12px;
        font-size: 13px;
        color: #28b2b4;
        i {
          margin-right: 4px;
        }
      }
    }
  }
}
#message .wrapper {
  background-color: #fff;
  padding: 20px;
}
</style>
