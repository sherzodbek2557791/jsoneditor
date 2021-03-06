import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import store from "./plugin/store";
import i18n from "./plugin/i18n";
import Mixins from "./components/mixins";
import router from "./plugin/router";

import "./assets/css/custom.scss";
import "./assets/css/element-variables.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import "jsoneditor/dist/jsoneditor.min.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);

for (let key in Mixins) Vue.mixin(Mixins[key]);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
