import type { ModalOptions, Player } from "@/models/data";
import store from "@/store/data";
import emitter from "../services/eventBus";
import firebase from "./firebase";
import Utils from "./utils";

class UserService {
  constructor() {}

  Init() {
    this.LoadUser();
  }

  LoadUser() {
    let user = this.GetCachedUser();
    if (user) {
      store.commit("saveUser", user);
    } else {
      let options: ModalOptions = {
        title: "Set Username",
        form: [
          {
            id: "username",
            label: "Username",
            type: "text",
          },
          {
            id: "useGPS",
            label: "Use GPS",
            description:
              "This will require permission from your device to use GPS to track your location.",
            type: "switch",
          },
        ],
        hasCloseButton: false,
        submitText: "Save",
        onCloseCallback: (modalOptions: ModalOptions) => {
          if (modalOptions.form && modalOptions.form[0].value) {
            this.CacheUser(
              modalOptions.form[0].value!,
              modalOptions.form[1].value!,
              true
            );
          }
        },
      };
      emitter.emit("open-modal", options);
    }
  }

  GetCachedUser(): Player | undefined {
    let data = localStorage.getItem("currentUser");
    if (data && data != "undefined") return JSON.parse(data) as Player;
    else return undefined;
  }

  CacheUser(username: string, useGPS: boolean, isNew: boolean = false) {
    let updatePlayer: Player;
    if (isNew) {
      updatePlayer = {
        sessionId: Utils.uuidv4(),
        username: username,
        useGPS: useGPS,
      };
    } else {
      updatePlayer = store.getters.user;
      updatePlayer.username = username;
      updatePlayer.useGPS = useGPS;
    }

    store.commit("saveUser", updatePlayer);

    let playerPath = store.getters.userPath;

    if (playerPath) {
      let updates: any = {};
      updates[playerPath + "/username"] = username;
      if (!useGPS) {
        updates[playerPath + "/location"] = null;
      }

      firebase.UpdateValues(updates);
    }
    localStorage.setItem("currentUser", JSON.stringify(updatePlayer));
  }

  async Disconnect() {
    let updates: any = {};
    let playerPath = store.getters.userPath;

    updates[playerPath] = null;
    await firebase.UpdateValues(updates);
  }
}
const userService = new UserService();
export default userService;
