import type { Room } from "@/models/data";
import { initializeApp } from "firebase/app";
export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBJsQeWbln9lR9B-W7jQZVCy9AWZyoe9pQ",
  authDomain: "tacmap-dev.firebaseapp.com",
  projectId: "tacmap-dev",
  storageBucket: "tacmap-dev.appspot.com",
  messagingSenderId: "278955153095",
  appId: "1:278955153095:web:dc491f9539c91be1e0d0e2",
});
import { getDatabase, ref, get, onValue, update, set } from "firebase/database";

const db = getDatabase(firebaseApp);

const firebase = {
  GetValue: async (path: string) => {
    const snap = await get(ref(db, path));
    return snap.val();
  },
  Subscribe: (path: string, callback: any) => {
    return onValue(ref(db, path), (snapshot) => {
      callback(snapshot.val());
    });
  },
  UpdateValues: async (updates: object) => {
    await update(ref(db), updates);
  },
  SetValue: async (path: string, object: object) => {
    const reference = ref(db, path);
    await set(reference, object);
  },
  // GetPlayerPath: (data: Room) => {
  //   try {
  //     for (const [t, team] of data.teams.entries()) {
  //       for (const [s, squad] of team.squads.entries()) {
  //         if (squad.players) {
  //           let p = squad.players.findIndex(
  //             (player) => player.sessionId == $store.currentUser.sessionId
  //           );
  //           if (p >= 0) {
  //             // remove player from old squad
  //             return `rooms/0/teams/${t}/squads/${s}/players/${p}`;
  //           }
  //         }
  //       }
  //     }
  //     return undefined;
  //   } catch (err) {
  //     Utils.error(err);
  //   }
  // },
};

export default firebase;
