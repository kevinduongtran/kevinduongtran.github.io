import AppOptions from './config.js';
import Utils from './utils.js';

export class LocationServices {
  map;
  markers = [];
  coords = {};
  rootApp;
  constructor(app) {
    try {
      this.rootApp = app;
      var mapOptions = {
        center: [36.157352, -115.1671312],
        // center: [36.651076, -114.5015082],
        zoom: 10,
        // zoom: 18,
        attributionControl: false,
        zoomControl: false,
      };
      this.map = new L.map('map', mapOptions);
      var layer = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
      this.map.addLayer(layer);
    } catch (err) {
      Utils.error(err);
    }
  }

  async ScanLocation(randomCoordinate) {
    let location;
    if (randomCoordinate) {
      let start = [36.16360240464562, -115.18453981692234];
      let randomGeo = Utils.randomGeo({ latitude: start[0], longitude: start[1] }, 20000);
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
      this.coords = { lat: location.coords.latitude, long: location.coords.longitude };
      this.rootApp.userService.currentUser.location = this.coords;
    }
  }

  GetLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (locationData) => resolve(locationData),
        (error) => console.log(error),
        AppOptions.geoLocationOptions
      );
    });
  }

  UpdateMap(lat, long, zoom) {
    this.map.setView([lat, long], zoom);
  }

  UpdateMarkers(markerData) {
    try {
      this.markers.forEach((el) => el.markerElement.remove());
      this.markers = [];
      markerData.forEach((marker) => {
        let markerObj = this.AddMarker(marker.lat, marker.long, marker.iconType, marker.squadNumber);
        markerObj.addTo(this.map);
        marker['markerElement'] = markerObj;
        this.markers.push(marker);
      });
    } catch (err) {
      Utils.error(err);
    }
  }

  AddMarker(lat, long, iconType, squadNumber) {
    return new L.Marker([lat, long], {
      icon: new L.DivIcon({
        className: 'my-div-icon',
        html: `${AppOptions.iconsMap[iconType].toString().replace('{{squadNumber}}', squadNumber)}`,
      }),
    });
  }

  // let newMarkers = markerData.filter((a) => !this.markers.some((b) => a.id === b.id));
  // newMarkers.forEach((marker) => {
  //   let markerObj = this.AddMarker(marker.lat, marker.long);
  //   markerObj.addTo(this.map);
  //   marker['markerElement'] = markerObj;
  //   this.markers.push(marker);
  // });
  // this.markers.forEach((marker) => {
  //   marker.markerElement.setLatLng(new L.LatLng(marker.lat, marker.long));
  // });
}
