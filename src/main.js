import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Router from "vue-router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import * as echarts from 'echarts';
import * as  DBChain from "dbchain-js-client";
Vue.config.productionTip = false;
Vue.prototype.$DBChain = DBChain;
console.log(echarts)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
import { APIURL } from '@/api/_init_.js';
// 多次点击同一路由控制台抛错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.prototype.$APIURL = APIURL;
console.log(APIURL)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
