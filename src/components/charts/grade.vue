// 成绩统计页面
<template>
  <div id="grade">
    <div ref="box" class="box"></div>
    <div class="notFound" v-if="isNull">
      <i class="iconfont icon-LC_icon_tips_fill"></i><span>该考生未参加考试</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "grade",
  data() {
    return {
      isNull: false, //原始数据
      tableDataX: [], //x轴数据 保存次数
      tableDataY: [], //y轴数据 保存分数
    }
  },
  mounted() {
    this.score();
  },
  methods: {
    async score() {
      let studentId = this.$route.query.studentId;

       let scoreAll=await this.$DBChain.Querier(this.appCode).score
       .equal('student_id',studentId).val();
       console.log(scoreAll)
       scoreAll.forEach((element,index) => {
            this.tableDataX.push(`第${index + 1}次`)
            this.tableDataY.push(element.score)
          });

          let boxDom = this.$refs["box"];
          console.log(boxDom)
          console.log(this)
          
          let scoreCharts = this.$echarts.init(boxDom);
          let option = {
            xAxis: {
              type: "category",
              data: this.tableDataX
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: this.tableDataY,
                type: "line",
                itemStyle: { normal: { label: { show: true } } }
              }
            ]
          };
          scoreCharts.setOption(option);
          scoreCharts.on("mouseover", params => {
            console.log(params.value);
          });

    }
  },
  computed: {
    appCode() {
      return this.$APIURL.AppCode;
    },
  },
};
</script>

<style lang="scss" scoped>
#grade {
  position: relative;
  .box{
    width: 600px;
    height: 400px;
  }
  .notFound {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>
