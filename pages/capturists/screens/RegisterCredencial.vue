<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoading" />

    <div v-else>
      <NavBar />
      <div>
        <div class="content">
          <p class="title">REGISTRAR IDENTIFICIÓN</p>
          <div class="container-form">
            <form @submit.prevent="handleSubmit">
              <div class="form-row">
                <!-- Columna del formulario -->
                <div class="form-column">
                  <div class="form-group">
                    <label
                      for="fullname"
                      :class="{ 'error-label': errors.fullname }"
                      >Nombre completo*</label
                    >
                    <input
                      type="text"
                      id="fullname"
                      v-model="form.fullname"
                      :class="['form-control', { error: errors.fullname }]"
                    />
                    <small v-if="errors.fullname" class="error-message">{{
                      errors.fullname
                    }}</small>
                  </div>

                  <div class="form-group">
                    <label
                      for="expirationDate"
                      :class="{ 'error-label': errors.expirationDate }"
                      >Fecha de expiración*</label
                    >
                    <input
                      type="datetime-local"
                      id="expirationDate"
                      v-model="form.expirationDate"
                      :class="[
                        'form-control',
                        { error: errors.expirationDate },
                      ]"
                    />
                    <small v-if="errors.fullname" class="error-message">{{
                      errors.expirationDate
                    }}</small>
                  </div>

                  <!-- Aqui van los campos del array de fields-->
                  <div
                    v-for="(field, index) in form.fields"
                    :key="index"
                    class="form-group"
                  >
                    <label
                      :for="'field-' + index"
                      :class="{ 'error-label': field.error }"
                    >
                      {{ field.tag }}<span v-if="field.required">*</span>
                    </label>
                    <input
                      :type="field.type.toLowerCase()"
                      :id="'field-' + index"
                      v-model="field.value"
                      :required="field.required"
                      :class="['form-control', { error: field.error }]"
                    />
                    <small v-if="field.error" class="error-message">{{
                      field.error
                    }}</small>
                  </div>
                </div>
                <!-- Columna de la imagen -->

                <div class="image-column">
                  <div class="dotted-border">
                    <div class="form-group">
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
                      <small
                        v-if="errors.image"
                        class="error-message"
                        style="text-align: center"
                        >{{ errors.image }}</small
                      >

                      <div v-if="imagePreview" class="image-preview">
                        <img
                          :src="imagePreview"
                          alt="Preview"
                          class="register-image"
                        />
                      </div>
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
  getFormByInstitutionId,
  registerCredential,
  getCapturistIdByEmail,
} from "~/services/ServicesCapturist";
import Swal from "sweetalert2";
import { ServiceCloudinary } from "~/services/ServiceCloudinary";
import CredentialLoader from "~/components/loader.vue";

export default {
  components: {
    CredentialLoader,
  },
  data() {
    return {
      form: {
        userAccountId: null,
        institutionId: null,
        fullname: null,
        expirationDate: null,
        image: null,
        fields: [],
      },

      imagePreview: null,
      errors: {
        fullname: "",
        expirationDate: "",
      },
      isLoading: false,
    };
  },
  methods: {
    goBack() {
      this.$router.push("./CredencialsList");
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
      let valid = true;

      if (!this.form.fullname) {
        this.errors.fullname = "El nombre es obligatorio";
        valid = false;
      } else {
        this.errors.fullname = "";
      }

      if (!this.form.expirationDate) {
        this.errors.expirationDate = "La fecha de expiración es obligatoria.";
        valid = false;
      } else {
        this.errors.expirationDate = "";
      }

      if (!this.form.image) {
        this.errors.image = "Es obligatorio subir una imagen";
        valid = false;
      } else {
        this.errors.image = "";
      }

      this.form.fields.forEach((field) => {
        field.error = null;

        if (field.required && !field.value) {
          field.error = `El campo ${field.tag} es obligatorio`;
          valid = false;
          return;
        }

        switch (field.type) {
          case "text":
            if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s.,]+$/.test(field.value)) {
              field.error = `El campo ${field.tag} debe contener solo letras y espacios`;
              valid = false;
            }
            break;
          case "alfanumerico":
            if (!/^[A-Za-z0-9áéíóúñÁÉÍÓÚÑ\s.,]+$/.test(field.value)) {
              field.error = `El campo ${field.tag} debe ser alfanumérico`;
              valid = false;
            }
            break;
          case "url":
            if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(field.value)) {
              field.error = `El campo ${field.tag} debe ser una URL válida`;
              valid = false;
            }
            break;
          case "tel":
            if (!/^\d{10}$/.test(field.value)) {
              field.error = `El campo ${field.tag} debe contener un número de teléfono válido de 10 dígitos`;
              valid = false;
            }
            break;
          case "number":
            if (isNaN(field.value)) {
              field.error = `El campo ${field.tag} debe ser un número válido`;
              valid = false;
            }
            break;
          case "date":
            if (
              !/^\d{4}-\d{2}-\d{2}$/.test(field.value) ||
              isNaN(Date.parse(field.value))
            ) {
              field.error = `El campo ${field.tag} debe ser una fecha válida en formato AAAA-MM-DD`;
              valid = false;
            }
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
              field.error = `El campo ${field.tag} debe ser un correo electrónico válido`;
              valid = false;
            }
            break;
          default:
            field.error = `El tipo ${field.type} no es soportado`;
            valid = false;
        }
      });

      if (!valid) {
        return;
      }
      try {
        this.isLoading = true;

        const imageUrl = await ServiceCloudinary.uploadImage(this.form.image);

        const newFields = this.form.fields.map((item) => ({
          tag: item.tag,
          value: item.value,
        }));
        var sendData = {
          userAccountId: this.form.userAccountId,
          institutionId: this.form.institutionId,
          fullname: this.form.fullname,
          expirationDate: this.form.expirationDate,
          userPhoto: imageUrl,
          fields: newFields,
        };
        const respose = await registerCredential(sendData);

        this.isLoading = false;
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Credencial registrada exitosamente",
          confirmButtonText: "Aceptar",
        });
        this.$router.push("./CredentialsList");
      } catch (e) {
        this.isLoading = false;
        Swal.fire({
          title: "Error",
          text: "Ocurrio un error al registrar credencial",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
  },
  async mounted() {
    try {
      this.isLoading = true;

      var instId = parseInt(localStorage.getItem("institutionId"));

      var userEmail = localStorage.getItem("email");
      const userEmailData = await getCapturistIdByEmail(userEmail); //obtienele id del capturista que retitra al usuario

      this.form.userAccountId = userEmailData.data;
      this.form.institutionId = instId;

      const data = await getFormByInstitutionId(instId);
      if (typeof data === "string") {
        this.errorMessage = "Error al cargar los capturistas.";
      } else {
        this.capturist = data;
      }

      var fieldsData = data.fields;
      var userInfo = data.userInfo;

      var inputs = [];
      for (let i = 0; i < fieldsData.length; i++) {
        var objeto = {
          tag: userInfo[i].tag,
          value: null,
          required: fieldsData[i].required,
          type: userInfo[i].type,
          error: null,
        };
        inputs.push(objeto);
      }
      this.form.fields = inputs;
    } catch (error) {
      this.errorMessage = "Error al cargar los capturistas.";
    } finally {
      this.isLoading = false;
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
  justify-content: start;
  align-items: center;
  margin-top: 30px;
}

.custom-file-input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.dotted-border {
  border: 2px dashed #ccc;
  padding: 15px;
  width: 100%;
  text-align: center;
  border-radius: 8px;
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
    max-width: 80%;
  }

  .image-column {
    flex: 1 1 40%;
    padding: 20px;
    margin-top: 10px;
    max-width: 80%;
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
  text-align: left;
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
  text-align: left;
  display: block;
}

label.error-label {
  color: red;
}
</style>
