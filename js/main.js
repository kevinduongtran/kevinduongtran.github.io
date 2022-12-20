import AppOptions from './config.js';
import { FirebaseServices } from './firebaseServices.js';
import { LocationServices } from './locationServices.js';
import { UserServices } from './userServices.js';
import Utils from './utils.js';

let logText = document.getElementById('log');

let App = class {
  locationService;
  userService;
  firebaseService;

  constructor() {
    self = this;
    this.locationService = new LocationServices();
    this.userService = new UserServices();
    this.firebaseService = new FirebaseServices();

    this.Update();

    EnableById('CreateRoomButton', false);
    EnableById('DeleteRoomButton', false);
    EnableById('JoinRoomButton', false);
    EnableById('LogInButton', true);
    EnableById('LogOutButton', false);
  }

  OnLocation(pos) {
    console.log(pos);
  }

  async CreateRoom(name, password) {
    let slug = Utils.slugify(name);
    let rooms = await this.firebaseService.Exists('rooms', slug);
    console.log(rooms);
    // this.firebase.AddToList('rooms', {
    //   name: name,
    //   slug: slug,
    //   password: password,
    //   players: [],
    // });
    // let rooms = await this.firebase.GetList('rooms');
    // let foundRoom = rooms.includes((el) => el.slug == slug);
    // if (!foundRoom)
    // this.firebase.AddToList('rooms', {
    //   name: name,
    //   slug: slug,
    //   password: password,
    //   players: [],
    // });
    // else alert(`A room called "${name}" already exists`);
  }

  async DeleteRoom(name) {
    let slug = Utils.slugify(name);
    // let rooms = await this.firebase.GetList('rooms');
    // rooms = rooms.filter((el) => el.slug != slug);
    // this.firebase.SetValue('rooms', rooms);
  }

  async JoinRoom(name) {
    let slug = Utils.slugify(name);
    // // check if room exists
    // let rooms = await this.firebase.GetList('rooms');
    // let room = rooms.find((el) => {
    //   return el.slug == slug;
    // });
    // if (room == undefined) return;
    // // check if im already in room
    // let players = room.players;
    // let playerFound = players.includes((el) => el.name == 'kevin');
    // if (playerFound) return;
    // players.push('kevin');
    // this.firebase.set;
  }

  Login(displayName) {
    this.userService.Login(displayName, this.OnLogin);
  }
  Logout() {
    this.userService.Logout();
  }

  OnExit() {
    this.firebaseService.UpdateUser(this.userService.currentUser.uuid, null);
    this.userService.Logout();
  }

  OnLogin(user) {
    self.firebaseService.AddUser(user);
    self.UpdateUserLocation();

    EnableById('JoinRoomButton', true);
    EnableById('LogInButton', false);
    EnableById('LogOutButton', true);
  }

  Update() {
    this.UpdateUserLocation();
    setTimeout(() => this.Update(), AppOptions.tickRateMS);
  }

  UpdateUserLocation() {
    this.locationService.GetLocation((location) => {
      // if currext user exists
      if (this.userService.currentUser) {
        //add location to user object
        this.userService.currentUser.location = {
          lat: location.coords.latitude,
          long: location.coords.longitude,
        };
        this.userService.UpdateUser(this.userService.currentUser);

        // update user on firebase
        this.firebaseService.UpdateUser(
          this.userService.currentUser.uuid,
          this.userService.currentUser
        );

        logText.innerHTML = JSON.stringify(this.userService.currentUser);
      }
    });
  }
};

const app = new App();

document.getElementById('CreateRoomButton').addEventListener('click', () => {
  let RoomName = window.prompt('Room Name', 'Cement Factory');
  let password = window.prompt('Room Password', '12345');
  app.CreateRoom(RoomName, password);
});
document.getElementById('DeleteRoomButton').addEventListener('click', () => {
  let RoomName = window.prompt('Room Name', 'Cement Factory');
  app.DeleteRoom(RoomName);
});
document.getElementById('JoinRoomButton').addEventListener('click', () => {
  let RoomName = window.prompt('Room Name', 'Cement Factory');
  app.JoinRoom(RoomName);
});
// document.getElementById('Test Button').addEventListener('click', () => {
//   app.firebase.AddToList('test', { a: 1 });
// });
document.getElementById('LogInButton').addEventListener('click', () => {
  let displayName = window.prompt('Display Name', 'kevin');
  app.Login(displayName);
});

var unloaded = false;
window.addEventListener('beforeunload', function (e) {
  if (unloaded) return;
  console.log('App Exited');
  app.OnExit();
});

window.addEventListener('visibilitychange', function (e) {
  if (document.visibilityState == 'hidden') {
    if (unloaded) return;
    console.log('App Exited');
    app.OnExit();
  }
});

function EnableById(id, enabled) {
  document.getElementById(id).hidden = !enabled;
}
