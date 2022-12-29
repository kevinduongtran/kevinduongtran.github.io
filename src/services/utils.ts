import type { Location } from "../models/data";
const Utils = {
  uuidv4: () => {
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  },

  distance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string
  ) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  },

  getCircularReplacer: () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  },
  randomRange: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  randomGeo: (center: Location, radius: number) => {
    var y0 = center.lat;
    var x0 = center.long;
    var rd = radius / 111300; //about 111300 meters in one degree

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    //Adjust the x-coordinate for the shrinking of the east-west distances
    var xp = x / Math.cos(y0);

    var newlat = y + y0;
    var newlon = x + x0;
    var newlon2 = xp + x0;

    return {
      latitude: newlat.toFixed(5),
      longitude: newlon.toFixed(5),
      longitude2: newlon2.toFixed(5),
      distance: Utils.CoordDistance(
        center.lat,
        center.long,
        newlat,
        newlon
      ).toFixed(2),
      distance2: Utils.CoordDistance(
        center.lat,
        center.long,
        newlat,
        newlon2
      ).toFixed(2),
    };
  },
  CoordDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => {
    var R = 6371000;
    var a =
      0.5 -
      Math.cos(((lat2 - lat1) * Math.PI) / 180) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(((lon2 - lon1) * Math.PI) / 180))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a));
  },

  pathToIndex: (path: string) => {
    let split = path.split("/");
    let result: any = { r: split[1], t: split[3], s: split[5] };
    if (split[7]) result["p"] = split[7];
    return result;
  },
  error: (msg: any) => {
    console.trace();
    console.error(msg);
  },
};
export default Utils;
