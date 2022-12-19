import Utils from './utils.js';

export class UserServices {
  constructor() {
    console.log('Init UserServices');
    this.currentUser = undefined;
    this.watchUser = false;
  }

  Login(displayName, callback) {
    this.currentUser = {
      displayName: displayName,
      location: {},
    };
    if (callback) callback(this.currentUser);
  }

  UpdateUser(user) {
    this.currentUser = user;
  }

  GetCurrentUser() {
    return this.currentUser;
  }

  Logout() {
    this.currentUser = undefined;
  }
}
