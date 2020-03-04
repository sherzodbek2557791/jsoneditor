import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "jsoneditor"
});

export default new Vuex.Store({
  state: {
    locale: "ru",
    templates: [],
    uiState: {
      writeUs: {
        confirmed: 185,
        rejected: 17
      }
    }
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
    },
    clearTemplate(state) {
      Vue.set(state, "templates", []);
    },
    setLocale(state, data) {
      Vue.set(state, "locale", data);
    },
    addWriteUsConfirm(state) {
      state.uiState.writeUs.confirmed++;
    },
    addWriteUsCancel(state) {
      state.uiState.writeUs.rejected++;
    }
  },
  actions: {},
  plugins: [vuexPersist.plugin]
});
