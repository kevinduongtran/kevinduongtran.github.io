import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js';
import { getDatabase, ref, set, push, query, orderByKey, get, equalTo, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import AppOptions from './config.js';

export class FirebaseServices {
  constructor() {
    console.log('Init Firebase Services');
    const firebaseConfig = AppOptions.firebaseVars[AppOptions.env];

    let app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    getAnalytics(app);

    this.WatchConnection();
  }

  WatchConnection() {
    const connectedRef = ref(this.db, '.info/connected');
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        this.OnConnected();
      } else {
        this.OnDisconnected();
      }
    });
  }

  OnConnected() {
    console.log('Connected');
  }

  OnDisconnected() {
    console.log('Not Connected');
  }

  // GetAllData() {
  //   const starCountRef = ref(this.db, 'posts/' + postId + '/starCount');
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //     updateStarCount(postElement, data);
  //   });
  // }
  async Exists(path, key, value) {
    const reference = ref(this.db, path);
    return await query(collection(this.db, path));
  }
  async GetValue(path) {
    const reference = ref(this.db, path);
    const snap = await get(reference);
    return snap.val();
  }
  async UpdateValues(updates) {
    const reference = ref(this.db);
    await update(reference, updates);
  }
  async SetValue(path, object) {
    const reference = ref(this.db, path);
    await set(reference, object);
  }

  async AddToList(path, object) {
    const reference = ref(this.db, path);
    const newPostRef = push(reference);
    await set(newPostRef, object);
  }

  async AddUser(user) {
    const reference = ref(this.db, 'users');
    const newPostRef = push(reference);
    const key = newPostRef.key;
    user.uuid = key;
    await set(newPostRef, user);
    return key;
  }

  async UpdateUser(uuid, newData) {
    const updates = {};
    updates[`/users/${uuid}`] = newData;
    await update(ref(this.db), updates);
  }
  async DeleteUser(uuid) {
    await remove(ref(this.db), `/users/${uuid}/`);
  }

  async Subscribe(callback) {
    const reference = ref(this.db, 'rooms/0');
    return onValue(reference, (snapshot) => {
      callback(snapshot.val());
    });
  }
}
