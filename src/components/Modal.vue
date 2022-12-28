<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import emitter from "../services/eventBus";

let modalEle = ref(null);
let form = ref(null);
let thisModalObj: Modal = null;

let modalOptions: Ref<ModalOptions> = ref({});

onMounted(() => {
  thisModalObj = new Modal(modalEle.value);
  emitter.on("open-modal", (options) => {
    modalOptions.value = options as ModalOptions;
    _show();
  });
});

function _show() {
  thisModalObj.show();
}

function _save() {
  if (modalOptions.value.form) {
    let el = form.value[0];
    if (!el.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
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

export interface ModalOptions {
  title?: string;
  bodyText?: string;
  form?: ModalFormType[];
  onCloseCallback?: any;
  hasCloseButton: bool;
  submitText: string;
}
export interface ModalFormType {
  type: string;
  id: string;
  value?: undefined;
  label: string;
}
</script>

<template>
  <button @click="_show">Test</button>
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
          <form
            ref="form"
            v-if="modalOptions.form?.length > 0"
            v-for="form in modalOptions.form"
            class="needs-validation"
            novalidate
            :key="form.label"
          >
            <!--  -->
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

            <!--  -->
          </form>
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
