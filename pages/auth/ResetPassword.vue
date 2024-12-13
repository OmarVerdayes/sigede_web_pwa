<template>
  <NavBar />
  <div class="screen-split">
    <div class="left-half">
      <div class="container">
        <img src="/logoweb.png" alt="" width="220px" />
        <p class="title">SIGEDE</p>
        <p class="sig">Sistema de gestión de credenciales</p>
      </div>
    </div>
    <div class="right-half">
      <div class="container2">
        <p class="title2">Recuperar Contraseña</p>
        <form @submit.prevent="handleChangePassword">
          <label for="new-password">Nueva Contraseña *</label>
          <input
            type="password"
            id="new-password"
            class="input-field"
            placeholder="Nueva contraseña"
            v-model="newPassword"
          />

          <label for="confirm-password">Confirmar Nueva Contraseña *</label>
          <input
            type="password"
            id="confirm-password"
            class="input-field"
            placeholder="Confirme nueva contraseña"
            v-model="confirmPassword"
          />

          <p v-if="error" class="error-message">{{ error }}</p>

          <button type="submit" class="login-button">Cambiar contraseña</button>
        </form>
        <a href="/" class="forgot-password">Iniciar sesión</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { changePassword } from "~/services/ServicesAuth";

const { $toast, $router } = useNuxtApp();

const newPassword = ref(null);
const confirmPassword = ref(null);
const error = ref("");

const validateForm = () => {
  let isValid = true;

  if (!newPassword.value || !confirmPassword.value) {
    error.value = "Todos los campos son obligatorios";
    isValid = false;
  }

  if (newPassword.value.length < 8) {
    error.value = "La contraseña debe tener al menos 8 caracteres.";
    isValid = false;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden.";
    isValid = false;
  }

  return isValid;
};

const handleChangePassword = async () => {
  if (validateForm()) {
    const data = {
      newPassword: newPassword.value,
      userEmail: localStorage.getItem("email"),
    };

    const response = await changePassword(data);

    if (response.status == 200) {
      $toast.success("Contraseña actualizada correctamente");
      $router.push("/");
    }
  }
};
</script>

<style scoped>
.screen-split {
  display: flex;
  height: 100vh;
}

.left-half {
  flex: 1;
  background-color: black;
}

.right-half {
  flex: 1;
  background-color: white;
}
.title {
  margin: 10px 0;
  text-align: center;
  color: rgb(255, 254, 254);
  font-size: 45px;
  letter-spacing: 0.8em;
  font-weight: 300;
}
.title2 {
  margin: 10px 0;
  color: black;
  font-size: 35px;
  font-weight: 300;
}
.sig {
  margin: 10px 0;
  color: rgb(255, 254, 254);
  font-size: 18px;
  font-weight: 300;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
}
.container2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

label {
  align-self: flex-start;
  font-size: 14px;
  margin: 10px 0 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 300;
  margin-bottom: 10px;
}
.forgot-password {
  margin-top: 15px;
  font-size: 14px;
  color: #999898;
  text-decoration: none;
  font-weight: bold;
}

.forgot-password:hover {
  color: #dbdada;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}
</style>
