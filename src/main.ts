import { createApp } from "vue";

import App from "./App.vue";
// import router from "./router";

import "./assets/main.css";
import "./assets/bootstrap.css";
import "./assets/bootstrap-icons.css";
import * as bootstrap from "bootstrap";

import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import Map from "./components/Map.vue";
import SettingsModal from "./components/SettingsModal.vue";

import store from "./store/data";

const app = createApp(App);

app.component("NavBar", NavBar);
app.component("SideBar", SideBar);
app.component("Map", Map);
app.component("SettingsModal", SettingsModal);

// app.use(router);
app.use(store);

app.mount("#app");
