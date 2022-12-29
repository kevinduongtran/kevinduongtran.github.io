<script lang="ts">
import firebase from "../services/firebase";
import emitter from "../services/eventBus";
import store from "../store/data";
import * as bootstrap from "bootstrap";
import type { ModalOptions, Team } from "@/models/data";
import userService from "@/services/user";
import locationService from "@/services/location";

export default {
  methods: {
    JoinSquad: async (teamIndex: number, squadIndex: number) => {
      let teams: Team[] = store.getters.allData.teams;
      let updates: any = {};

      let playersInNewSquad = teams[teamIndex].squads[squadIndex].players;

      // check if player alreay in squad
      if (
        playersInNewSquad &&
        playersInNewSquad.some(
          (player) => player.sessionId == store.getters.sessionId
        )
      ) {
        return;
      }

      // clear out current user path
      let playerPath = store.getters.userPath;
      if (playerPath) {
        updates[playerPath] = null;
      }

      let user = { ...store.getters.user, location: store.getters.location };

      // if there are no players in squad, just add the player as a squad leader
      // otherwise, append player to list
      if (playersInNewSquad == null) {
        updates[`rooms/0/teams/${teamIndex}/squads/${squadIndex}/players`] = [
          user,
        ];
      } else {
        playersInNewSquad.push(user);
        updates[`rooms/0/teams/${teamIndex}/squads/${squadIndex}/players/`] =
          playersInNewSquad;
      }

      await firebase.UpdateValues(updates);

      // assign squad leaders
      let data = store.getters.allData;

      for (let t = 0; t < data.teams.length; t++) {
        const team = data.teams[t];
        for (let s = 0; s < team.squads.length; s++) {
          let players = data.teams[t].squads[s].players;
          if (players) {
            players = players.filter(function () {
              return true;
            });
            data.teams[t].squads[s].players = players;
          }
        }
      }
      await firebase.SetValue("rooms/0", data);
    },
    openModal() {
      let options: ModalOptions = {
        title: "Change Username",
        form: [
          {
            id: "username",
            label: "Username",
            type: "text",
            value: store.getters.username,
          },
          {
            id: "useGPS",
            label: "GPS Tracking",
            type: "switch",
            description:
              "By turning on GPS tracking, you will be able to share your current location with your teammates.",
            value: store.getters.useGPS,
          },
        ],
        hasCloseButton: false,
        submitText: "Save",
        onCloseCallback: (modalOptions: ModalOptions) => {
          if (modalOptions.form && modalOptions.form[0].value)
            userService.CacheUser(
              modalOptions.form[0].value!,
              modalOptions.form[1].value!
            );
        },
      };
      emitter.emit("open-modal", options);
    },
    async resetDB() {
      console.log("reset");
      await firebase.SetValue("/", {
        rooms: [
          {
            gamemode: "TDM",
            roomId: "ea3f1eaf-f712-44eb-bd47-a2e783df974e",
            roomName: "Cement Factory",
            map: {
              name: "LVPP",
              location: {
                lat: 36.1390106,
                long: -115.1765157,
              },
              zoom: 10,
            },
            spotDurationMS: 15000,
            teams: [
              {
                id: "efdcb41b-15ba-4b6a-8833-8eafe744e770",
                markers: {},
                squads: [
                  {
                    id: "8fa53299-5b1e-4e34-a679-37b8c1b72124",
                    players: [],
                    squadNumber: 1,
                  },
                  {
                    id: "514a5efc-149f-4d71-bbd1-9534d0bb6518",
                    players: [],
                    squadNumber: 2,
                  },
                  {
                    id: "35633482-b82a-4852-a66e-697d82bd3121",
                    players: [],
                    squadNumber: 3,
                  },
                ],
                teamName: "BLUFOR",
              },
              {
                id: "opfor123",
                markers: {},
                squads: [
                  {
                    id: "17cf4d12-3115-4a44-9964-c5c4f3ee49f5",
                    players: [],
                    squadNumber: 1,
                  },
                  {
                    id: "cb64b16a-93c5-406e-83d7-a1d576b26c70",
                    players: [],
                    squadNumber: 2,
                  },
                  {
                    id: "2fd3ad96-3dc4-4f12-b728-48f4f7389ba2",
                    players: [],
                    squadNumber: 3,
                  },
                ],
                teamName: "OPFOR",
              },
            ],
          },
        ],
      });
    },
    async Disconnect() {
      await userService.Disconnect();
    },
  },

  mounted() {
    emitter.on("toggle-sidebar", () => {
      let offCanvasElement = document.getElementById("offcanvasExample");
      let offCanvas = new bootstrap.Offcanvas(offCanvasElement!);
      offCanvas.toggle();
    });
  },
};
</script>

<template>
  <div
    class="offcanvas offcanvas-start"
    tabindex="-1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-body">
      <div class="offcanvas-title">TEAMS</div>

      <!-- Team Template -->
      <div
        class="team"
        id="team-{{team.id}}"
        v-for="(team, t) in $store.getters.allData.teams"
        :key="team.id"
      >
        <h2 class="accordion-header">{{ team.teamName }}</h2>

        <!-- Squad template -->
        <div
          class="squad ms-4 mb-2 from-template"
          id="squad-{{squad.id}}"
          v-for="(squad, s) in team.squads"
          :key="squad.id"
          @click="JoinSquad(t, s)"
        >
          <div class="squad-header">
            SQUAD {{ squad.squadNumber }}
            <i class="bi bi-box-arrow-in-down-right float-end"></i>
          </div>

          <!-- Player Template -->
          <div
            class="squad-member ms-4 mt-2 mb-2 from-template"
            v-for="(player, p) in squad.players"
            :key="player.sessionId"
          >
            <i class="bi bi-star-fill me-1" v-if="p == 0"></i>
            {{ player.username }}
          </div>
        </div>
      </div>
    </div>
    <footer class="ps-3 pt-2 pb-2">
      <div class="offcanvas-title">Playing As</div>
      <div>
        <h5
          class="d-inline align-middle"
          @click="openModal"
          id="username-display"
        >
          {{ $store.getters.username }}
        </h5>

        <button
          class="btn btn-sm btn-outline-primary d-inline float-end me-2"
          id="disconnect-button"
          type="button"
          @click="Disconnect()"
        >
          <i class="bi bi-box-arrow-right"></i>
        </button>
        <button
          class="btn btn-sm btn-outline-primary d-inline float-end me-2 dev-only"
          id="log-button"
          type="button"
          data-bs-toggle="offcanvas"
          href="#logOffCanvas"
          role="button"
          aria-controls="logOffCanvas"
        >
          <i class="bi bi-code-square"></i>
        </button>
        <button
          class="btn btn-sm btn-outline-primary d-inline float-end me-2 dev-only"
          @click="resetDB"
          type="button"
        >
          <i class="bi bi-database-gear"></i>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
