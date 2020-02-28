import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "jsoneditor"
});

export default new Vuex.Store({
  state: {
    templates: [],
    uiState: {}
  },
  mutations: {
    setTemplate(state, data) {
      let { templates } = state;
      for (let key in templates) {
        let template = templates[key];
        let { id } = template;
        if (id === data["id"]) {
          Vue.set(templates, key, data);
          return;
        }
      }
      templates.push(data);
    }
  },
  actions: {},
  plugins: [vuexPersist.plugin]
});
