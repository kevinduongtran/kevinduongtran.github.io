<script lang="ts">
import emitter from "../services/eventBus";
import { Modal } from "bootstrap";
import { ref } from "vue";
import type { ModalOptions } from "@/models/data";
import store from "@/store/data";

let modal: Modal;
let onCloseCallback: any;
export default {
  data() {
    return {
      username: "",
      useGPS: "",
      error: false,
      onCloseCallback: undefined,
    };
  },
  methods: {
    Save(event: any) {
      event.stopPropagation();
      this.error = false;
      if (!this.username || this.username.length == 0) {
        this.error = true;
      } else {
        onCloseCallback(this.username, this.useGPS);
        modal.hide();
      }
    },
  },
  mounted() {
    if (this.$refs.modalRef) {
      modal = new Modal(this.$refs.modalRef as string);
    }

    emitter.on("open-settings-modal", (callback) => {
      onCloseCallback = callback;
      this.username = store.getters.username;
      this.useGPS = store.getters.useGPS;
      modal.show();
    });
  },
};
</script>

<template>
  <div class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Settings</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form ref="form" class="needs-validation">
            <div class="mb-4">
              <!--Input -->
              <label for="validationDefaultUsername" class="form-label"
                >Username</label
              >
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': error }"
                  id="validationDefaultUsername"
                  v-model="username"
                  required
                />
              </div>
              <div class="invalid-feedback">Please choose a username.</div>
            </div>

            <!--Switch -->

            <div class="mb-2">
              <label for="validationDefaultUsername" class="form-label"
                >GPS Tracking</label
              >
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  v-model="useGPS"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >By turning on GPS tracking, you will be able to share your
                  current location with your teammates.</label
                >
              </div>
            </div>
            <!--  -->
          </form>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>

          <button class="btn btn-secondary" type="submit" @click="Save">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
