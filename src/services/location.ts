import Constants from "./constants";
import Utils from "./utils";
import type { Location, MarkerData, Player } from "@/models/data";
import store from "@/store/data";
import firebase from "./firebase";

class LocationService {
  location: Location | any = {};
  lastCoord = {
    lat: 0,
    long: 0,
  };

  constructor() {}

  Init() {
    this.Update();
  }

  async Update() {
    if (store.getters.useGPS) {
      let location = await this.ScanLocation(true);
      if (location) {
        this.location = location;
        store.commit("saveLocation", this.location);

        if (store.getters.userInSquad) this.UpdateUserLocation();
      }
    }

    setTimeout(() => this.Update(), Constants.tickRateMS);
  }

  async UpdateUserLocation() {
    let shouldUpdate =
      Utils.CoordDistance(
        this.location.lat,
        this.location.long,
        this.lastCoord.lat,
        this.lastCoord.long
      ) > Constants.updateMeters;

    if (shouldUpdate && store.getters.user) {
      const updates: any = {};
      let playerPath = store.getters.userPath;
      if (playerPath) {
        updates[playerPath + "/location"] = this.location;
      }
      await firebase.UpdateValues(updates);
    }
  }

  async GetLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (locationData) => {
          let coords: Location = {
            lat: locationData.coords.latitude,
            long: locationData.coords.longitude,
          };
          return resolve(coords);
        },
        (error) => console.log(error),
        Constants.geoLocationOptions
      );
    });
  }

  async ScanLocation(
    randomCoord: boolean = false
  ): Promise<Location | undefined> {
    let location: Location = { lat: 0, long: 0 };
    if (randomCoord) {
      let start = [36.16360240464562, -115.18453981692234];
      let randomGeo = Utils.randomGeo({ lat: start[0], long: start[1] }, 20000);
      location = {
        lat: Number.parseFloat(randomGeo.latitude),
        long: Number.parseFloat(randomGeo.longitude),
      };
      return location;
    } else {
      return await this.GetLocation();
    }
  }

  async GetMarkers() {
    let data = store.getters.allData;
    let sessionId = store.getters.sessionId;

    if (!data.teams) return [];
    let players: Player[] = [];
    let markerData: MarkerData[] = [];
    let currentTeam: number | undefined;
    let currentSquad: number | undefined;
    for (const [t, team] of data.teams.entries()) {
      for (const [s, squad] of team.squads.entries()) {
        if (squad.players) {
          for (const [p, player] of squad.players.entries()) {
            if (player.sessionId == sessionId) {
              currentTeam = t;
              currentSquad = s;
            }
          }
        }
      }
    }

    for (const [t, team] of data.teams.entries()) {
      for (const [s, squad] of team.squads.entries()) {
        if (squad.players) {
          for (const [p, player] of squad.players.entries()) {
            // all players
            let isTeamMember = t == currentTeam;
            let isSquadMember = s == currentSquad;
            let isSquadLeader = p == 0;
            let isMe = player.sessionId == sessionId;

            player["squadNumber"] = s;
            // team
            if (isTeamMember) player["iconType"] = "team-member";
            if (isTeamMember && isSquadLeader)
              player["iconType"] = "squad-leader";

            // my squad
            if (isTeamMember && isSquadMember)
              player["iconType"] = "squad-member";
            if (isTeamMember && isSquadLeader && isSquadMember)
              player["iconType"] = "squadmate-squad-leader";

            // me
            if (isMe) player["iconType"] = "me";
            if (isSquadLeader && isMe) player["iconType"] = "me-squad-leader";

            if (player["iconType"]) players.push(player);
          }
        }
      }
    }
    players.forEach((player: Player) => {
      if (player.location) {
        markerData.push({
          squadNumber: player.squadNumber! + 1,
          iconType: player.iconType!,
          lat: player.location.lat,
          long: player.location.long,
          id: sessionId,
          owner: player.sessionId,
        });
      }
    });
    store.commit("saveMarkerData", markerData);
  }

  async createSpotMarker(location: Location, type: string) {
    let updates: any = {};
    let path = store.getters.userPath;
    let i = Utils.pathToIndex(path);
    let markers = store.getters.allData.teams[i.t].markers;
    let currentMarkers: MarkerData[];

    if (markers && markers.length > 0) currentMarkers = markers;

    let uuid = Utils.uuidv4();
    let marker: MarkerData = {
      squadNumber: i.s,
      iconType: type,
      lat: location.lat,
      long: location.long,
      id: uuid,
      owner: store.getters.sessionId,
      createTime: new Date().getTime(),
    };

    let key = `rooms/0/teams/${i.t}/markers/${uuid}`;
    updates[key] = marker;
    await firebase.UpdateValues(updates);

    return key;
  }

  async removeSpotMarker(path: string) {
    let now = new Date().getTime();
    let allMyMarkers = store.getters.allSpotMarkers;
    let expireTime = store.getters.spotDurationMS;

    allMyMarkers.forEach(async (el: any) => {
      let key = Object.keys(el)[0];
      if (now - el[key].createTime > expireTime) {
        await firebase.DeleteValue(key);
      }
    });
    await firebase.DeleteValue(path);
  }
}
const locationService = new LocationService();
export default locationService;
