import AppOptions from './config.js';

export class LocationServices {
  constructor() {
    console.log('Init Location Services');
  }

  async GetLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((locationData) => resolve(locationData), this.error, AppOptions.geoLocationOptions);
    });
  }
  // success(pos) {
  //   var crd = pos.coords;
  //   console.log('Successfully determined a user position:', crd);

  //   log('Your current position is:');
  //   log(`Latitude : ${crd.latitude}`);
  //   log(`Longitude: ${crd.longitude}`);
  //   log(`More or less ${crd.accuracy} meters.`);
  // }

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}
