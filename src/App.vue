<template>
  <div id="app">
    <div id="jsoneditor" style="width: 400px; height: 400px;"></div>
    <div id="jsoneditor2" style="width: 400px; height: 400px;"></div>
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
      }
    };
  },
  mounted() {
    this.leftCreate();
    this.rightCreate();
  },
  methods: {
    leftCreate() {
      const container = document.getElementById("jsoneditor");
      const options = { mode: "code" };
      const editor = new JSONEditor(container, options);

      editor.set(this.jsonData);
    },
    rightCreate() {
      const container = document.getElementById("jsoneditor2");
      const options = {};
      const editor = new JSONEditor(container, options);

      editor.set(this.jsonData);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
