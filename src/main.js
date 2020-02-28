import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import store from "./plugin/store";

import "./assets/css/custom.scss";
import "./assets/css/element-variables.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import "jsoneditor/dist/jsoneditor.min.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
