import type { Room, Player, Location, MarkerData } from "@/models/data";
import Utils from "@/services/utils";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state: {
    gameData: {} as Room,
    currentUser: {} as Player,
    location: {} as Location,
    markerData: {} as any,
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
    saveMarkerData(state, markerData) {
      state.markerData.markers = markerData;
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
      if (!state.gameData.teams) return false;
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
    getTeam(state): number | undefined {
      let sessionId = state.currentUser.sessionId!;
      if (!state.gameData.teams) return undefined;
      for (const [t, team] of state.gameData.teams.entries()) {
        let stringTeam = JSON.stringify(team);
        if (stringTeam.includes(sessionId)) return t;
      }
      return undefined;
    },
    location(state): Location {
      return state.location;
    },
    mapCenter(state): Location | undefined {
      if (!state.gameData.map) return { lat: 0, long: 0 };
      return state.gameData.map.location;
    },
    zoom(state): Number {
      if (!state.gameData.map) return 0;
      return state.gameData.map.zoom;
    },
    markers(state) {
      return state.markerData.markers;
    },
    spotMarkers(state) {
      let team: any = store.getters.getTeam;
      if (!state.gameData.teams) return undefined;
      if (!state.gameData.teams[team]) return undefined;
      if (!state.gameData.teams[team].markers) return undefined;
      return state.gameData.teams[team].markers;
    },
    allSpotMarkers(state) {
      let foundMarkers = [];
      let sessionId = state.currentUser.sessionId;
      if (!state.gameData.teams) return undefined;

      for (const [t, team] of state.gameData.teams.entries()) {
        if (team.markers) {
          for (const key of Object.keys(team.markers)) {
            foundMarkers.push({
              [`rooms/0/teams/${t}/markers/${key}`]: team.markers[key as any],
            });
          }
        }
      }
      return foundMarkers;
    },
    spotDurationMS(state) {
      return state.gameData.spotDurationMS;
    },
    useGPS(state) {
      return state.currentUser.useGPS;
    },
  },
});

export default store;
