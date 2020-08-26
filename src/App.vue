<template>
  <div id="app">
    <div class="container" v-loading="loading">
      <div class="container-header">
        <div class="container-header-left">
          <el-button
            type="success"
            size="medium"
            icon="fas fa-save"
            @click="onSaveClick"
            :disabled="!isDataChanged"
          />
          <el-button
            type="success"
            size="medium"
            icon="fas fa-save"
            @click="onSaveGenerateUrlClick"
            :disabled="!isDataChanged"
          >
            {{ $t("main.save-and-generate-url") }}</el-button
          >
          <template v-if="hasJsonUrl">
            <el-link class="json-link" @click="copyText(jsonUrl)">{{
              jsonUrl
            }}</el-link>
            <span style="color: red">{{ jsonLoadingError }}</span>
            <el-button type="danger" @click="clearUrlTemplate">Clear</el-button>
          </template>
        </div>
        <div class="container-header-center"></div>
        <div class="container-header-right">
          <locale-select />
          <write-us />
        </div>
      </div>
      <div class="container-body">
        <div id="first" class="first"></div>
        <div id="separator" class="separator">
          <el-button
            size="mini"
            type="success"
            icon="fas fa-long-arrow-alt-right"
            @click="onClickRight"
            circle
            plain
          />
          <div></div>
          <el-button
            size="mini"
            type="warning"
            icon="fas fa-long-arrow-alt-left"
            @click="onClickLeft"
            circle
            plain
          />
        </div>
        <div id="second" class="second"></div>
      </div>
      <div class="statistic-body container-footer"></div>
    </div>
  </div>
</template>

<script>
import JSONEditor from "jsoneditor";
import uuid from "./plugin/uuid";
import LocaleSelect from "./components/LocaleSelect";
import WriteUs from "./components/WriteUs";

export default {
  components: { LocaleSelect, WriteUs },
  data() {
    return {
      loading: false,
      jsonDataCached: null,
      jsonDataId: null,
      jsonData: {
        Array: [1, 2, 3],
        Boolean: true,
        Null: null,
        Number: 123,
        Object: { a: "b", c: "d" },
        String: "Hello World"
      },
      leftEditor: null,
      rightEditor: null,
      jsonLoadingError: null
    };
  },
  mounted() {
    const unwatch = this.$watch(
      () => this.$route,
      function() {
        this.loadData(this);
        unwatch();
      }
    );
    this.loadAll();
  },
  methods: {
    loadAll() {
      this.loadData(this);
      this.leftCreate();
      this.rightCreate();
      this.loadMethod();
      this.cacheData(this.jsonData);
      this.loadStatistic();
    },
    loadData() {
      let { jsonFileUrl } = this.$route.params;
      if (jsonFileUrl) {
        this.loading = true;
        this.jsonDownload(`${this.fileDownloadUrl}/${jsonFileUrl}`)
          .then(async ({ data }) => {
            data.text().then(text => {
              this.jsonData = JSON.parse(text);
              this.jsonDataId = uuid();
              this.jsonLoadingError = null;
              this.leftEditor.set(this.jsonData);
              this.rightEditor.set(this.jsonData);
              this.cacheData(this.jsonData);
              this.loading = false;
            });
          })
          .catch(error => {
            console.error(error);
            this.jsonLoadingError = error;
            this.loadFromStore();
            this.loading = false;
          });
      } else this.loadFromStore();
    },
    loadFromStore() {
      let { templates } = this.$store.state;
      if (templates.length > 0) {
        let template = templates[0];
        this.jsonDataId = template.id;
        this.jsonData = template.data;
      } else {
        this.jsonDataId = uuid();
      }
    },
    cacheData(data) {
      this.$set(this, "jsonDataCached", JSON.stringify(data));
    },
    onClickLeft() {
      let t = this.rightEditor.get();
      console.log("t", t);
      this.leftEditor.set(t);
    },
    onClickRight() {
      let t = this.leftEditor.get();
      this.rightEditor.set(t);
    },
    onLeftChanged() {
      let json = this.leftEditor.get();
      this.$set(this, "jsonData", json);
    },
    leftCreate() {
      const container = document.getElementById("first");
      this.leftEditor = new JSONEditor(container, {
        mode: "code",
        onChange: this.onLeftChanged
      });
      this.leftEditor.set(this.jsonData);
    },
    rightCreate() {
      const container = document.getElementById("second");
      this.rightEditor = new JSONEditor(container, {});
      this.rightEditor.set(this.jsonData);
    },
    onSaveClick() {
      this.jsonData = this.leftEditor.get();
      this.rightEditor.set(this.jsonData);
      let { jsonDataId, jsonData } = this;
      this.$store.commit("setTemplate", {
        id: jsonDataId,
        data: jsonData
      });
      this.cacheData(jsonData);
    },
    clearUrlTemplate() {
      this.jsonData = {
        Array: [1, 2, 3],
        Boolean: true,
        Null: null,
        Number: 123,
        Object: { a: "b", c: "d" },
        String: "Hello World"
      };
      this.cacheData(this.jsonData);
      this.$store.commit("clearTemplate");
      this.leftEditor.set(this.jsonData);
      this.rightEditor.set(this.jsonData);
      this.$router.push({ path: `/` });
    },
    onSaveGenerateUrlClick() {
      this.jsonData = this.leftEditor.get();
      this.rightEditor.set(this.jsonData);

      let { jsonData: data, jsonDataId: id } = this;
      this.jsonUpload(this.fileUploadUrl, data)
        .then(({ data }) => {
          let { storedFullName } = data;
          console.log("SUCCESS!!", data);

          let baseUrl = new RegExp(/^.*\//).exec(window.location.href);
          let url = `${baseUrl}${storedFullName}`;
          this.$store.commit("setTemplate", { id, url, data: this.jsonData });
          this.cacheData(this.jsonData);
          this.$router.push({ path: `/${storedFullName}` });
        })
        .catch(error => {
          console.error("FAILURE!!", error);
        });
    },
    loadMethod() {
      // function is used for dragging and moving
      function dragElement(element, direction) {
        let md; // remember mouse down info
        const first = document.getElementById("first");
        const second = document.getElementById("second");

        element.onmousedown = onMouseDown;

        function onMouseDown(e) {
          if (!e.toElement.classList.contains("separator")) {
            return;
          }
          //console.log("mouse down: " + e.clientX);
          md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: first.offsetWidth,
            secondWidth: second.offsetWidth
          };
          document.onmousemove = onMouseMove;
          document.onmouseup = () => {
            //console.log("mouse up");
            document.onmousemove = document.onmouseup = null;
          };
        }

        function onMouseMove(e) {
          //console.log("mouse move: " + e.clientX);
          let delta = { x: e.clientX - md.e.x, y: e.clientY - md.e.y };

          if (direction === "H") {
            // Horizontal
            // prevent negative-sized elements
            delta.x = Math.min(
              Math.max(delta.x, -md.firstWidth),
              md.secondWidth
            );

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = md.firstWidth + delta.x + "px";
            second.style.width = md.secondWidth - delta.x + "px";
          }
        }
      }

      dragElement(document.getElementById("separator"), "H");
    },
    loadStatistic() {
      let content = document.querySelector("#www-statistic");
      let body = this.$el.getElementsByClassName("statistic-body")[0];
      if (content == null || content.parentNode == null) return;

      content.parentNode.removeChild(content);
      body.appendChild(content);
      content.style.display = "block";
    },
    copyText(value) {
      let input = document.createElement("input");
      input.setAttribute("value", value);
      document.body.appendChild(input);
      input.select();
      let result = document.execCommand("copy");
      document.body.removeChild(input);
      if (result)
        this.$message.success(this.$t("main.copiedText", { text: value }));
      else this.$message.error("main.cannotCopy");
    }
  },
  computed: {
    topRat() {
      return document.top_r + document.top_rat;
    },
    hasJsonUrl() {
      let { jsonUrl } = this;
      return jsonUrl && jsonUrl.length > 0;
    },
    jsonUrl() {
      let { jsonFileUrl } = this.$route.params;
      let baseUrl = new RegExp(/^.*\//).exec(window.location.href);
      if (jsonFileUrl) return `${baseUrl}${jsonFileUrl}`;

      let { templates } = this.$store.state;
      if (templates.length > 0) {
        let template = templates[0];
        return template.url;
      } else {
        return null;
      }
    },
    isDataChanged() {
      let { jsonDataCached, jsonData } = this;
      if (!jsonDataCached || !jsonData) return false;

      let regex = /\r?\n|\r/g;
      let data = JSON.stringify(jsonData).replace(regex, "");
      let cache = jsonDataCached.replace(regex, "");
      return data !== cache;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  right: 5px;

  &-header {
    height: 48px;
    background: #3883fa;
    align-items: center;
    align-content: center;
    display: flex;
    padding: 0 10px;

    /deep/ .is-underline:hover:after {
      border-bottom: 1px solid white !important;
    }

    .json-link {
      margin-left: 5px;
      margin-right: 5px;

      /deep/ .el-link--inner {
        color: white;
      }
    }
    &-center {
      flex-grow: 1;
    }
  }

  &-body {
    flex-grow: 1;
    display: flex;
    position: relative;
    max-height: calc(100% - 48px);
  }

  &-footer {
    height: 48px;
  }

  .first {
    width: 49%;
    height: 100%;
    min-width: 10px;
  }
  .separator {
    width: 2%;
    cursor: e-resize;
    display: flex;
    justify-content: center;
    flex-direction: column;
    button {
      font-size: 15pt;
    }
  }
  .second {
    width: 49%;
    height: 100%;
    min-width: 10px;
  }
}
</style>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
