<template>
  <div id="app">
    <div class="container">
      <div id="first" class="first"></div>
      <div id="separator" class="separator">
        <button @click="onDown">-></button>
        <button @click="onUp">(-</button>
      </div>
      <div id="second" class="second"></div>
    </div>
  </div>
</template>

<script>
import JSONEditor from "jsoneditor";

// get json
// const updatedJson = editor.get();
export default {
  name: "app",
  data() {
    return {
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
    this.leftCreate();
    this.rightCreate();
  },
  methods: {
    onUp() {
      let t = this.rightEditor.get();
      this.leftEditor.set(t);
    },
    onDown() {
      let t = this.leftEditor.get();
      this.rightEditor.set(t);
    },
    leftCreate() {
      const container = document.getElementById("first");
      this.leftEditor = new JSONEditor(container, { mode: "code" });
      this.leftEditor.set(this.jsonData);
    },
    rightCreate() {
      const container = document.getElementById("second");
      this.rightEditor = new JSONEditor(container, {});
      this.rightEditor.set(this.jsonData);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
}

.first {
  width: 49%;
  height: 100%;
  min-width: 10px;
}
.separator {
  width: 2%;
}
.second {
  width: 49%;
  height: 100%;
  min-width: 10px;
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
