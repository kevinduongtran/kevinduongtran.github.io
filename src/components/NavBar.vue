<script lang="ts">
import emitter from "../services/eventBus";
export default {
  data() {
    return { time: "" };
  },
  methods: {
    openOffCanvas() {
      emitter.emit("toggle-sidebar");
    },
  },
  created() {
    // update the time every second
    setInterval(() => {
      let time = new Date();
      this.time = `${time.toLocaleTimeString("it-IT")}`;
    }, 1000);
  },
};
</script>

<template>
  <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="p-2" type="button" @click="openOffCanvas()">
        <i class="bi bi-play"></i>
      </a>
      <a class="navbar-brand" href="#">.</a>
    </div>
  </nav> -->
  <div class="container">
    <span class="clock">{{ time }}</span>
    <button
      class="open-side-bar btn btn-primary m-2"
      type="button"
      @click="openOffCanvas()"
    >
      <i class="bi bi-list"></i>
    </button>
  </div>
</template>

<style scoped>
.container,
.btn,
.clock {
  z-index: 1000;
}
.open-side-bar {
  position: absolute;
  top: 0;
  left: 0;
}

.clock {
  position: fixed;
  text-align: center;
  left: 0;
  top: -5px;
  background-color: rgba(0, 0, 0, 0.25);
  width: calc(100%);
  font-family: glassGauge;
  color: var(--bs-green);
  font-size: 3em;
  text-shadow: 2px 2px black;
}
</style>
