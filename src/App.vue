<script lang="ts">
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
// import Modal from "./components/Modal.vue";
import Map from "./components/Map.vue";
import type { Room, Player } from "./models/data";
import { inject, ref } from "vue";
import firebase from "./services/firebase";
import emitter from "./services/eventBus";
import store from "./store/data";
import userService from "./services/user";
import locationService from "./services/location";
import Constants from "./services/constants";
import type { Modal } from "bootstrap";

let receivedData = false;
export default {
  methods: {},
  async mounted() {
    userService.Init();
    locationService.Init();

    firebase.Subscribe("rooms/0", async (snap: Room) => {
      {
        store.commit("saveData", snap);
        await locationService.GetMarkers();
      }
    });

    emitter.on("toggle-modal", () => {
      let thisModal = ref<Modal | null>(null);
      thisModal.value?.show();
    });
  },
};
</script>

<template>
  <NavBar></NavBar>
  <SideBar></SideBar>
  <Map></Map>
  <Modal title="Model title goes here" ref="thisModal"> </Modal>
</template>

<style>
@font-face {
  font-family: glassGauge;
  src: url("./src/assets/glass-gauge.ttf");
}
</style>
