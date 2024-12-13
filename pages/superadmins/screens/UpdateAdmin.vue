<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoading" />

    <div v-else>
      <NavBar />
      <div>
        <div class="content">
          <p class="title">ACTUALIZAR ADMINISTRADOR</p>
          <div class="container-form">
            <div>
              <form @submit.prevent="handleSubmit">
                <div class="form-row">
                  <div class="form-column">
                    <div class="form-group">
                      <label for="name" :class="{ 'error-label': errors.name }"
                        >Nombre*</label
                      >
                      <input
                        type="text"
                        id="name"
                        v-model="form.name"
                        :class="['form-control', { error: errors.name }]"
                        placeholder="Nombre"
                      />
                      <small v-if="errors.name" class="error-message">{{
                        errors.name
                      }}</small>
                    </div>

                    <div class="form-group">
                      <label
                        for="email"
                        :class="{ 'error-label': errors.email }"
                        >Correo*</label
                      >
                      <input
                        id="email"
                        v-model="form.email"
                        :class="['form-control', { error: errors.email }]"
                        placeholder="Correo"
                      />
                      <small v-if="errors.email" class="error-message">{{
                        errors.email
                      }}</small>
                    </div>

                    <div class="form-group">
                      <div class="radio-group">
                        <label class="radio-container">
                          <div
                            class="rb-text"
                            style="background-color: #93d7b0"
                          >
                            Activo
                          </div>
                          <input
                            type="radio"
                            value="activo"
                            v-model="form.status"
                          />
                        </label>
                        <label class="radio-container">
                          <div
                            class="rb-text"
                            style="background-color: #ff8000"
                          >
                            Suspendido
                          </div>
                          <input
                            type="radio"
                            value="suspendido"
                            v-model="form.status"
                          />
                        </label>
                        <label class="radio-container">
                          <div
                            class="rb-text"
                            style="background-color: #d79393"
                          >
                            Inactivo
                          </div>
                          <input
                            type="radio"
                            value="inactivo"
                            v-model="form.status"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="image-column">
                    <img
                      src="/customer_service.png"
                      alt="Imagen de registro"
                      class="register-image"
                    />
                  </div>
                </div>

                <div class="button-group">
                  <button type="submit" class="submit-btn">
                    Actualizar capturista
                  </button>
                  <button
                    type="button"
                    class="cancel-btn"
                    @click="backToOrganizationDetails"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal personalizado
          para el modal personalizado se require:
          isVisible: el cuan indica si el modal esta visible
          title: el cual coloca como titulo del modal
          message: el texto que se mostrara en la parte gris/cuerpo
          close: el cual cierra el modal
          confirm: el cual ejecuta la funcion que se conecta con el back 
          icon: el icono que se muestra en la pantalla, SOLO SE MANDA EL NOMBRE DEL ICONO ejemplo "triangle-exclamation"
           -->
    <CustomConfirmationModal
      :isVisible="showModal"
      title="Advertencia"
      message="¿Estas seguro de actualizar la informacion de este capturista?"
      @close="closeModal"
      @confirm="submitForm"
      icon="triangle-exclamation"
    />
  </div>
</template>

<script>
import CustomConfirmationModal from "~/utils/CustomConfirmationModal.vue";
import { getOneAdmin, updateAdmin } from "~/services/ServicesSuperAdmin";

export default {
  components: {
    CustomConfirmationModal,
  },
  name: "ManagerCapturist",
  data() {
    return {
      form: {
        userAccountId: null,
        name: null,
        email: null,
        status: "activo",
      },
      errors: {
        name: "",
        email: "",
      },
      showModal: false,
      isLoading: true,
      institutionId: null,
    };
  },
  methods: {
    closeModal() {
      //metodo para cerrar el modal
      this.showModal = false;
    },
    async submitForm() {
      try {
        const response = await updateAdmin(this.form);

        if (response.message !== "Ocurrio un error inesperado.") {
          this.backToOrganizationDetails();
        }
        this.showModal = false;
      } catch (e) {
        this.backToOrganizationDetails();
      }
    },
    handleSubmit() {
      this.errors = {
        name: "",
        email: "",
      };

      let valid = true;

      if (!this.form.name) {
        this.errors.name = "El nombre es obligatorio";
        valid = false;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!this.form.email) {
        this.errors.email = "El correo es obligatorio";
        valid = false;
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = "El correo electrónico no es válido";
        valid = false;
      }

      if (!valid) {
        return;
      }

      // Muestra el modal de confirmación
      this.showModal = true;
    },
    backToOrganizationDetails() {
      var institutionId = this.institutionId;
      this.$router.push({
        path: "./OrganizationDetails",
        query: { institutionId },
      });
    },
    backToOrganizationsList() {
      this.$router.push("./OrganizationsList");
    },
  },
  async mounted() {
    const userAccountId = this.$route.query.userAccountId;
    const instId = this.$route.query.institutionId;
    this.institutionId = instId;

    if (userAccountId && instId) {
      try {
        const response = await getOneAdmin(userAccountId, instId);
        if (response === "Ocurrio un error en la peticion") {
          this.isLoading = false;
          this.backToOrganizationDetails();
        } else {
          this.isLoading = false;
          this.form = response;
        }
      } catch (e) {
        this.backToOrganizationDetails();
      }
    } else if (instId) {
      this.backToOrganizationDetails();
    } else {
      backToOrganizationsList();
    }
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  overflow-y: auto;
}

.full-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #e4e4e4;
  overflow: hidden;
}

.content {
  text-align: center;
  justify-content: center;
  padding: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);
}

.title {
  margin: 10px 0;
  text-align: center;
  color: black;
  text-decoration: underline;
  font-size: 35px;
  letter-spacing: 0.15em;
  font-weight: 300;
}

.container-form {
  border-radius: 8px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  padding: 3%;
  box-sizing: border-box;
  overflow-y: hidden;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.form-column,
.image-column {
  flex: 1 1 100%;
  padding: 20px;
}

.image-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .form-column {
    flex: 1 1 60%;
    order: 1;
  }

  .image-column {
    flex: 1 1 40%;
    order: 2;
  }
}

@media (max-width: 767px) {
  .form-column {
    order: 2;
  }

  .image-column {
    order: 1;
  }
}

.register-image {
  max-width: 75%;
  max-height: 250px;
  height: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #e0e0e0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.form-control.error {
  border-color: red;
  background-color: #ffdddd;
  box-shadow: 0px 4px 8px rgba(255, 0, 0, 0.1);
}

.error-message {
  color: red;
  font-size: 12px;
  display: block;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  gap: 60px;
}

.submit-btn,
.cancel-btn {
  padding: 8px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
}

.submit-btn {
  background-color: black;
}

.cancel-btn {
  background-color: #87342c;
}

label {
  font-weight: bold;
  color: black;
}

label.error-label {
  color: red;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.radio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  width: 150px;
  text-align: center;
  box-sizing: border-box;
}

.radio-container input {
  margin-bottom: 5px;
}

.rb-text {
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  width: 100%;
  text-align: center;
  height: 35px;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .radio-group {
    flex-direction: column;
    align-items: center;
  }

  .radio-container {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 424px) {
  .title {
    font-size: 30px;
  }
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 15px;
}
</style>
