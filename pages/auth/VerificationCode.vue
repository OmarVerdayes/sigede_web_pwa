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
        <p class="title2">Validar Código</p>

        <label for="code">Código de verificación *</label>
        <div class="code-inputs">
          <input
            v-model="code[0]"
            type="text"
            class="code-input"
            maxlength="1"
            @input="focusNext($event, 0)"
            ref="input0"
          />
          <input
            v-model="code[1]"
            type="text"
            class="code-input"
            maxlength="1"
            @input="focusNext($event, 1)"
            ref="input1"
          />
          <input
            v-model="code[2]"
            type="text"
            class="code-input"
            maxlength="1"
            @input="focusNext($event, 2)"
            ref="input2"
          />
          <input
            v-model="code[3]"
            type="text"
            class="code-input"
            maxlength="1"
            @input="focusNext($event, 3)"
            ref="input3"
          />
          <input
            v-model="code[4]"
            type="text"
            class="code-input"
            maxlength="1"
            @input="focusNext($event, 4)"
            ref="input4"
          />
          <input
            v-model="code[5]"
            type="text"
            class="code-input"
            maxlength="1"
            @input="focusNext($event, 5)"
            ref="input5"
          />
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button class="login-button" @click="validateCode">Validar</button>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceAuth from "~/services/ServicesAuth";

export default {
  data() {
    return {
      code: ["", "", "", "", "", ""],
      errorMessage: "",
    };
  },
  methods: {
    focusNext(event, index) {
      const inputs = document.querySelectorAll(".code-input");
      if (event.target.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    },
    async validateCode() {
      const userEmail = localStorage.getItem("email");

      if (!userEmail) {
        this.errorMessage =
          "No se pudo obtener el correo. Por favor, inicie sesión nuevamente.";
        return;
      }

      const code = this.code.join("");
      if (code.length < 6) {
        this.errorMessage =
          "Por favor, ingrese el código de verificación completo.";
        return;
      }

      try {
        const response = await ServiceAuth.validateVerificationCode(
          code,
          userEmail
        );

        if (response.status == 200) {
          this.$router.push("/auth/ResetPassword");
          this.errorMessage = "";
        } else {
          this.errorMessage = response.message || "El código es incorrecto.";
        }
      } catch (error) {
        this.errorMessage =
          "Hubo un problema al validar el código: " + error.message;
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

.code-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.code-input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #000;
  border-radius: 8px;
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

.resend-text {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.forgot-password {
  margin-top: 5px;
  font-size: 14px;
  color: #999898;
  text-decoration: none;
  font-weight: bold;
}

.forgot-password:hover {
  color: #dbdada;
}
</style>
