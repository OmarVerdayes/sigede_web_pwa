<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <div class="center">
          <i class="fas icon" :class="'fa-' + icon"></i>
        </div>
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="confirm-btn" @click="confirmAction">Confirmar</button>
        <button class="cancel-btn" @click="closeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomConfirmationModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Confirmación",
    },
    message: {
      type: String,
      default: "¿Estás seguro de realizar esta acción?",
    },
    icon: {
      type: String,
      default: null,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    confirmAction() {
      this.$emit("confirm");
    },
  },
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 8px;
}

.modal-content {
  background: white;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 10px;
  background-color: black;
  color: white;
  font-size: 20px;
}

.modal-body {
  margin: 0;
  padding: 10px;
  font-size: 20px;
  color: black;
  background-color: #d9d9d9;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 10px;
  background-color: black;
}

.confirm-btn {
  background-color: #af8440;
  color: white;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  height: 35px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #87342c;
  color: white;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  height: 35px;
  cursor: pointer;
}
.icon {
  font-size: 100px;
  margin-left: -50px;
}
</style>
