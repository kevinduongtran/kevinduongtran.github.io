<script lang="ts">
import emitter from "../services/eventBus";
export default {
  methods: {
    openOffCanvas() {
      emitter.emit("toggle-sidebar");
    },
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="p-2" type="button" @click="openOffCanvas()">
        <i class="bi bi-play"></i>
      </a>
      <a class="navbar-brand" href="#">.</a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  z-index: 1000;
}
</style>
