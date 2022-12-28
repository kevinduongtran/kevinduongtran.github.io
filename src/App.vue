<script lang="ts">
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import Modal from "./components/Modal.vue";
import Map from "./components/Map.vue";
import type { Room, Player } from "./models/data.ts";
import { inject, ref } from "vue";
import firebase from "./services/firebase";
import emitter from "./services/eventBus";
import store from "./store/data";
import userService from "./services/user";
import locationService from "./services/location";
import Constants from "./services/constants";

export default {
  methods: {},
  async mounted() {
    userService.Init();
    locationService.Init();
    let loc = await locationService.GetLocation();
    console.log(loc);
    firebase.Subscribe("rooms/0", (snap: Room) =>
      store.commit("saveData", snap)
    );
    emitter.on("toggle-modal", () => {
      let thisModal = ref(null);
      thisModal.value?.show();
    });
  },
};
</script>

<template>
  <NavBar></NavBar>
  <SideBar></SideBar>
  <!-- <Map></Map> -->
  <Modal title="Model title goes here" ref="thisModal"> </Modal>
</template>

<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
