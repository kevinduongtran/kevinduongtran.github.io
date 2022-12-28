import type { Room, Player, Location } from "@/models/data";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state: {
    gameData: {} as Room,
    currentUser: {} as Player,
    location: {} as Location,
  },
  mutations: {
    save(state, data) {
      console.log("save", data);
      state.gameData = data;
    },
  },
  actions: {},
  getters: {
    allData(state): Room {
      return state.gameData;
    },
    username(state): String {
      return state.currentUser.username;
    },
  },
});

export default store;
