const Constants = {
  firebaseVars: {
    live: {
      apiKey: "AIzaSyB1eJwaJojvqt3WvJ4pEv5rLZmI-kFhojA",
      authDomain: "tacmap-b51b4.firebaseapp.com",
      databaseURL: "https://tacmap-b51b4-default-rtdb.firebaseio.com",
      projectId: "tacmap-b51b4",
      storageBucket: "tacmap-b51b4.appspot.com",
      messagingSenderId: "967896842326",
      appId: "1:967896842326:web:5c2e93fc457c2aa8febbf7",
    },
    dev: {
      apiKey: "AIzaSyBJsQeWbln9lR9B-W7jQZVCy9AWZyoe9pQ",
      authDomain: "tacmap-dev.firebaseapp.com",
      projectId: "tacmap-dev",
      storageBucket: "tacmap-dev.appspot.com",
      messagingSenderId: "278955153095",
      appId: "1:278955153095:web:dc491f9539c91be1e0d0e2",
    },
  },
  geoLocationOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
  tickRateMS: 10000,
};

export default Constants;
