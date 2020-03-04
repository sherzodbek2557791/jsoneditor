<template>
  <div id="app">
    <div class="container">
      <div class="container-header">
        <div class="container-header-left">
          <el-button
            type="success"
            size="medium"
            icon="fas fa-save"
            @click="onSaveClick"
            :disabled="!isDataChanged"
          />
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
          <button @click="onClickRight">
            <i class="fas fa-long-arrow-alt-right"></i>
          </button>
          <button @click="onClickLeft">
            <i class="fas fa-long-arrow-alt-left"></i>
          </button>
        </div>
        <div id="second" class="second"></div>
      </div>
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
      rightEditor: null
    };
  },
  mounted() {
    this.loadFromStore();
    this.leftCreate();
    this.rightCreate();
    this.loadMethod();
    this.cacheData(this.jsonData);
  },
  methods: {
    loadFromStore() {
      console.log(
        "this.$store.state.templates",
        JSON.stringify(this.$store.state.templates)
      );
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
      let { jsonDataId, jsonData } = this;
      this.$store.commit("setTemplate", {
        id: jsonDataId,
        data: jsonData
      });
      this.cacheData(jsonData);
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
    }
  },
  computed: {
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

  .first {
    width: 49%;
    height: 100%;
    min-width: 10px;
  }
  .separator {
    width: 2%;
    cursor: e-resize;
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
