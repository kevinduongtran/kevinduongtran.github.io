import Constants from "./constants";
import Utils from "./utils";
import type { Location } from "@/models/data";
import store from "@/store/data";

class LocationService {
  lastCoord = {
    lat: 0,
    long: 0,
  };

  constructor() {}

  Init() {
    this.Update();
  }

  async Update() {
    try {
      // this.locationService.ScanLocation(AppOptions.fakeLocation);
      // if (this.userInSquad) this.UpdateUserLocation();

      let loc = await this.GetLocation();
      store.commit("saveLocation", loc);

      setTimeout(() => this.Update(), Constants.tickRateMS);
    } catch (err) {
      Utils.error(err);
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

  async ScanLocation(randomCoord: boolean = false) {
    let location;
    if (randomCoord) {
      let start = [36.16360240464562, -115.18453981692234];
      let randomGeo = Utils.randomGeo({ lat: start[0], long: start[1] }, 20000);
      location = {
        coords: {
          latitude: randomGeo.latitude,
          longitude: randomGeo.longitude,
        },
      };
    } else {
      location = await this.GetLocation();
    }
    if (location) {
      console.log(location);
      // this.rootApp.userService.currentUser.location = location;
    }
  }
}
const locationService = new LocationService();
export default locationService;
