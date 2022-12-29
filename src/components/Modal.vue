<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import emitter from "../services/eventBus";
import type { ModalOptions } from "@/models/data";
import type { Ref } from "vue";

let modalEle = ref(null);
let form = ref<HTMLFormElement>();
let thisModalObj: Modal;

let modalOptions: Ref<ModalOptions> = ref({});

onMounted(() => {
  thisModalObj = new Modal(modalEle.value!);
  emitter.on("open-modal", (options) => {
    modalOptions.value = options as ModalOptions;
    _show();
  });
});

function _show() {
  thisModalObj.show();
}

function _save() {
  if (modalOptions.value.form && form != null && form.value != null) {
    let el = form.value[0];
    if (!(el as HTMLSelectElement).checkValidity()) {
      event!.preventDefault();
      event!.stopPropagation();
    } else {
      thisModalObj.hide();
    }

    el.classList.add("was-validated");

    if (modalOptions.value.onCloseCallback)
      modalOptions.value.onCloseCallback(modalOptions.value);
  } else {
    thisModalObj.hide();
  }
}

defineExpose({ show: _show });
</script>

<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby=""
    aria-hidden="true"
    ref="modalEle"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ modalOptions.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ modalOptions.bodyText }}
          <div
            v-if="
              modalOptions != undefined &&
              modalOptions.form != undefined &&
              modalOptions.form.length > 0
            "
          >
            <form
              ref="form"
              v-for="form in modalOptions.form"
              class="needs-validation"
              novalidate
              :key="form.label"
            >
              <div v-if="form.type == `text`" class="mb-4">
                <!--Input -->
                <label for="validationDefaultUsername" class="form-label">{{
                  form.label
                }}</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    id="validationDefaultUsername"
                    v-model="form.value"
                    required
                  />
                </div>
                <div class="invalid-feedback">Please choose a username.</div>
              </div>

              <!--Switch -->

              <div v-if="form.type == `switch`" class="mb-2">
                <label for="validationDefaultUsername" class="form-label">{{
                  form.label
                }}</label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    v-model="form.value"
                  />
                  <label
                    class="form-check-label"
                    for="flexSwitchCheckDefault"
                    >{{ form.description }}</label
                  >
                </div>
              </div>
              <!--  -->
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
          <button
            v-if="modalOptions.hasCloseButton"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button class="btn btn-secondary" type="submit" @click="_save">
            {{ modalOptions.submitText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
