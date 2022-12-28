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
    saveData(state, data) {
      state.gameData = data;
    },
    saveUser(state, user: Player) {
      state.currentUser = user;
    },
    saveUserName(state, username: string) {
      state.currentUser.username = username;
    },
    saveLocation(state, location: Location) {
      state.location = location;
    },
  },
  actions: {},
  getters: {
    allData(state): Room {
      return state.gameData;
    },
    username(state): String {
      return state.currentUser.username!;
    },
    sessionId(state): String {
      return state.currentUser.sessionId!;
    },
    user(state): Player {
      return state.currentUser;
    },
    userInSquad(state): boolean {
      let sessionId = state.currentUser.sessionId!;
      for (const [t, team] of state.gameData.teams.entries()) {
        for (const [s, squad] of team.squads.entries()) {
          if (squad.players) {
            let found = squad.players.some(
              (player) => player.sessionId == sessionId
            );
            if (found) return true;
          }
        }
      }
      return false;
    },
    userPath(state): string | undefined {
      let sessionId = state.currentUser.sessionId!;
      for (const [t, team] of state.gameData.teams.entries()) {
        for (const [s, squad] of team.squads.entries()) {
          if (squad.players) {
            let p = squad.players.findIndex(
              (player) => player.sessionId == sessionId
            );
            if (p >= 0) {
              // remove player from old squad
              return `rooms/0/teams/${t}/squads/${s}/players/${p}`;
            }
          }
        }
      }
      return undefined;
    },
  },
});

export default store;
