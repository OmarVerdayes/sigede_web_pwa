<template>
  <NavBar />
  <div class="screen-split">
    <div class="left-half">
      <div class="container">
        <img src="../../public/logoweb.png" alt="" width="220px" />
        <p class="title">SIGEDE</p>
        <p class="sig">Sistema de gestión de credenciales</p>
      </div>
    </div>
    <div class="right-half">
      <div class="container2">
        <p class="title2">Recuperar Contraseña</p>
        <label for="email">Correo electrónico *</label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="input-field"
          placeholder="Correo electrónico"
        />

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button class="login-button" @click="handleRecoverPassword">
          Enviar
        </button>
        <a href="/" class="forgot-password">Iniciar sesión</a>
      </div>
    </div>
  </div>
</template>

<script>
import { sendVerificationCode } from "~/services/ServicesAuth";

export default {
  data() {
    return {
      email: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleRecoverPassword() {
      try {
        if (!this.email) {
          this.errorMessage =
            "Por favor, ingresa un correo electrónico válido.";
          return;
        }
        const response = await sendVerificationCode({ userEmail: this.email });

        if (response.status == 200) {
          this.errorMessage = "";
          localStorage.setItem("email", this.email);
          this.$router.push("/auth/VerificationCode");
        }
      } catch (error) {
        this.errorMessage =
          "Hubo un error al enviar el código. Intenta nuevamente.";
      }
    },
  },
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

.status-message {
  margin-top: 15px;
  font-size: 14px;
  color: #c1270c;
  font-weight: bold;
}
</style>
