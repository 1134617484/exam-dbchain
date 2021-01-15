import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import * as  DBChain from "dbchain-js-client";
Vue.config.productionTip = false;
Vue.prototype.$DBChain = DBChain;
Vue.use(ElementUI);
import { APIURL } from '@/api/_init_.js';

Vue.prototype.$APIURL = APIURL;
console.log(APIURL)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
