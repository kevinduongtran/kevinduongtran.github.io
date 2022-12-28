<script lang="ts">
import firebase from "../services/firebase";
import emitter from "../services/eventBus";
import store from "../store/data";
import * as bootstrap from "bootstrap";
import type { ModalOptions } from "./Modal.vue";

export default {
  methods: {
    JoinSquad: (teamIndex: number, squadIndex: number) => {
      console.log("join", teamIndex, squadIndex);
      let updates: object = {};
    },
    openModal() {
      let options: ModalOptions = {
        title: "Change Username",
        form: [
          {
            id: "username",
            label: "Username",
            type: "text",
          },
        ],
        hasCloseButton: false,
        submitText: "Save",
        onCloseCallback: (modalOptions: ModalOptions) => {
          console.log(modalOptions);
        },
      };
      emitter.emit("open-modal", options);
    },
  },
  mounted() {
    emitter.on("toggle-sidebar", () => {
      let offCanvasElement = document.getElementById("offcanvasExample");
      let offCanvas = new bootstrap.Offcanvas(offCanvasElement);
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
          test
          {{ $store.getters.username }}
        </h5>

        <button
          class="btn btn-sm btn-outline-primary d-inline float-end me-2"
          id="disconnect-button"
          type="button"
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
          id="reset-db-button"
          type="button"
        >
          <i class="bi bi-database-gear"></i>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
