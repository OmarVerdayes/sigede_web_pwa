<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoading" />

    <div v-else>
      <NavBar />
      <div>
        <div class="content">
          <p class="title">ACTUALIZAR EMPRESA</p>
          <div class="container-form">
            <form @submit.prevent="handleSubmit">
              <div class="form-row">
                <!-- Columna del formulario -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="name" :class="{ 'error-label': errors.name }"
                      >Nombre de la institución*</label
                    >
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      :class="['form-control', { error: errors.name }]"
                    />
                    <small v-if="errors.name" class="error-message">{{
                      errors.name
                    }}</small>
                  </div>

                  <div class="form-group">
                    <label for="phone" :class="{ 'error-label': errors.phone }"
                      >Teléfono de contacto*</label
                    >
                    <input
                      type="text"
                      id="phone"
                      v-model="form.phone"
                      :class="['form-control', { error: errors.phone }]"
                    />
                    <small v-if="errors.phone" class="error-message">{{
                      errors.phone
                    }}</small>
                  </div>

                  <div class="form-group">
                    <label for="email" :class="{ 'error-label': errors.email }"
                      >Correo de contacto*</label
                    >
                    <input
                      id="email"
                      v-model="form.email"
                      :class="['form-control', { error: errors.email }]"
                    />
                    <small v-if="errors.email" class="error-message">{{
                      errors.email
                    }}</small>
                  </div>

                  <div class="form-group">
                    <label
                      for="address"
                      :class="{ 'error-label': errors.address }"
                      >Dirección*</label
                    >
                    <input
                      type="address"
                      id="address"
                      v-model="form.address"
                      :class="['form-control', { error: errors.address }]"
                    />
                    <small v-if="errors.address" class="error-message">{{
                      errors.address
                    }}</small>
                  </div>

                  <div class="form-group">
                    <div class="radio-group">
                      <label class="radio-container">
                        <div class="rb-text" style="background-color: #93d7b0">
                          Habilitado
                        </div>
                        <input
                          type="radio"
                          value="HABILITADO"
                          v-model="form.status"
                        />
                      </label>
                      <label class="radio-container">
                        <div class="rb-text" style="background-color: #d79393">
                          Inhabilitado
                        </div>
                        <input
                          type="radio"
                          value="INHABILITADO"
                          v-model="form.status"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div class="image-column">
                  <div class="form-group dotted-border">
                    <label for="imageUpload">Subir imagen*</label>
                    <div class="custom-file-input-container">
                      <button type="button" class="custom-file-button">
                        Seleccionar archivo
                      </button>
                      <span class="file-name">{{
                        form.image
                          ? form.image.name
                          : "No se ha seleccionado ningún archivo"
                      }}</span>
                      <input
                        type="file"
                        id="imageUpload"
                        @change="handleImageUpload"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        class="custom-file-input"
                      />
                    </div>
                    <small v-if="errors.image" class="error-message">{{
                      errors.image
                    }}</small>

                    <div v-if="imagePreview" class="image-preview">
                      <p>Nueva imagen</p>
                      <img
                        :src="imagePreview"
                        alt="Preview"
                        class="register-image"
                      />
                    </div>
                    <div v-if="!imagePreview" class="image-preview">
                      <p>Imagen actual</p>
                      <img
                        :src="oldImage"
                        alt="Preview"
                        class="register-image"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="button-group">
                <button type="submit" class="submit-btn">
                  Registrar institución
                </button>
                <button type="button" class="cancel-btn" @click="goBack">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getInstitutionInfoByinstitutionId,
  updateInstitution,
} from "~/services/ServicesSuperAdmin";
import { ServiceCloudinary } from "~/services/ServiceCloudinary";
import Swal from "sweetalert2";
import CredentialLoader from "~/components/loader.vue";

export default {
  components: {
    CredentialLoader,
  },
  data() {
    return {
      form: {},
      oldImage: null,
      imagePreview: null,
      errors: {
        name: "",
        email: "",
        phone: "",
        address: "",
        image: "",
      },
      isLoading: true,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const validImageTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/gif",
        ];
        if (!validImageTypes.includes(file.type)) {
          this.errors.image =
            "El archivo debe ser una imagen válida (.png, .jpg, .jpeg, .gif)";
          this.form.image = null;
          this.imagePreview = null;
        } else {
          this.errors.image = "";
          this.form.image = file;
          this.imagePreview = URL.createObjectURL(file);
        }
      }
    },
    async handleSubmit() {
      this.errors = {
        name: "",
        email: "",
        phone: "",
        address: "",
        image: "",
      };

      let valid = true;

      if (!this.form.name) {
        this.errors.name = "El nombre es obligatorio";
        valid = false;
      }
      if (!this.form.phone) {
        this.errors.phone = "El teléfono es obligatorio";
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

      if (!this.form.address) {
        this.errors.address = "La dirección es obligatoria";
        valid = false;
      }
      if (!valid) {
        return;
      }

      try {
        var sendData = {
          institutionId: this.form.institutionId,
          institutionName: this.form.name,
          institutionAddress: this.form.address,
          institutionEmail: this.form.email,
          institutionPhone: this.form.phone,
          institutionStatus: this.form.status,
        };

        this.isLoading = true;

        if (this.form.image) {
          const imageUrl = await ServiceCloudinary.uploadImage(this.form.image);
          sendData.logo = imageUrl;
        } else {
          sendData.logo = this.form.oldImage;
        }

        const response = await updateInstitution(sendData);

        if (response === "Ocurrio un error en la peticion") {
          this.errorMessage = "Ocurrio un error en la peticion.";
        } else {
          this.form = {
            name: "",
            email: "",
            phone: "",
            address: "",
            image: null,
          };
          this.isLoading = false;
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Institución actualizada exitosamente",
            confirmButtonText: "Aceptar",
          });
          this.goBack();
        }
      } catch (e) {
        this.errorMessage = "Ocurrio un error en la peticion.";
        this.isLoading = false;

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al actualizar la institución",
          confirmButtonText: "Aceptar",
        });
      }
    },
  },
  async mounted() {
    const instId = this.$route.query.institutionId;
    if (instId) {
      try {
        const response = await getInstitutionInfoByinstitutionId(instId);

        if (typeof response === "string") {
          this.errorMessage = "Error al cargar la info de la institucion.";
        } else if (response) {
          this.institutionData = response;

          this.form = {
            institutionId: response.institutionId,
            name: response.name,
            email: response.email_contact,
            phone: response.phoneContact,
            address: response.address,
            image: null,
            status: response.institutionStatus,
          };
          this.oldImage = response.logo;
        } else {
          this.goBack();
        }
      } catch (error) {
        this.errorMessage = "Error al cargar los administradores.";
      } finally {
        this.isLoading = false;
      }
    } else {
      this.goBack();
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
  padding: 5px;
}

.image-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dotted-border {
  border: 2px dashed #ccc;
  padding: 15px;
  width: 100%;
  text-align: center;
  border-radius: 8px;
}

.custom-file-input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.custom-file-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.custom-file-button {
  background-color: #e0e0e0;
  color: black;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  max-width: 300px;
  width: 90%;
}

.file-name {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  text-align: center;
}

.register-image {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .form-column {
    flex: 1 1 60%;
    padding: 20px;
  }

  .image-column {
    flex: 1 1 40%;
    padding: 20px;
  }
}

.register-image {
  max-width: 75%;
  max-height: 300px;
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

.radio-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
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
</style>
