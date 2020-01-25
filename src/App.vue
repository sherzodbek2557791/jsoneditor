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
    this.loadMethod();
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
    },
    loadMethod() {
      // function is used for dragging and moving
      function dragElement(element, direction) {
        let md; // remember mouse down info
        const first = document.getElementById("first");
        const second = document.getElementById("second");

        element.onmousedown = onMouseDown;

        function onMouseDown(e) {
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
