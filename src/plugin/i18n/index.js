import Vue from "vue";
import VueI18n from "vue-i18n";
import localeRu from "./locale-ru.json";
import localeUz from "./locale-uz.json";
import store from "../store";

Vue.use(VueI18n);

export default new VueI18n({
  locale: store.state.locale,
  fallbackLocale: "ru",
  messages: {
    ru: localeRu,
    uz: localeUz
  }
});
