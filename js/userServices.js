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

  Logout(callback) {
    let uuid = this.currentUser.uuid;
    this.currentUser = undefined;
    this.ClearUserCache();

    if (callback) callback(uuid);
  }

  CacheUser() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  ClearUserCache() {
    localStorage.removeItem('currentUser');
  }

  LoadUser(success, failure) {
    let tempUser = localStorage.getItem('currentUser');
    if (tempUser != null) {
      this.currentUser = JSON.parse(tempUser);
      success();
    }
  }
}
