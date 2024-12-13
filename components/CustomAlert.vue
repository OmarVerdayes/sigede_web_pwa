<template>
  <div class="custom-alert-overlay">
    <div class="custom-alert">
      <div class="custom-alert-header">
        <h1 class="custom-alert-title">{{ title }}</h1>
      </div>
      <div class="custom-alert-body">
        <div class="custom-alert-icon">
          <img src="/icon-warning.png" alt="Advertencia" />
        </div>
        <p class="custom-alert-text">
          {{ message }}
        </p>
      </div>
      <div class="custom-alert-footer">
        <button @click="onConfirm" class="custom-alert-confirm">
          {{ confirmText }}
        </button>
        <button @click="onCancel" class="custom-alert-cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: "ADVERTENCIA",
  },
  message: {
    type: String,
    default: "¿Estás seguro de realizar esta acción?",
  },
  confirmText: {
    type: String,
    default: "Confirmar",
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};
</script>

<style>
.custom-alert-overlay {
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
.custom-alert {
  background: white;
  border-radius: 8px;
  text-align: center;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
.custom-alert-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
  background-color: black;
  color: white;
  font-size: 20px;
}
.custom-alert-body {
  margin: 0;
  padding: 10px;
  font-size: 20px;
  color: black;
  background-color: #d9d9d9;
}
.custom-alert-icon img {
  width: 200px;
  margin-top: 50px;
  margin-bottom: 30px;
}
.custom-alert-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.custom-alert-text {
  font-size: 20px;
  margin-bottom: 20px;
  color: black;
  font-weight: bold;
  margin-bottom: 50px;
}
.custom-alert-footer {
  display: flex;
  margin: 0;
  padding: 20px;
  background-color: black;
  justify-content: center;
  gap: 20px;
}
.custom-alert-confirm {
  background-color: #af8440;
  color: white;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  height: 35px;
  cursor: pointer;
  width: 150px;
}
.custom-alert-cancel {
  background-color: #872e2c;
  color: white;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  height: 35px;
  cursor: pointer;
  width: 150px;
}
</style>
