<template>
  <div>
    <CredentialLoader v-if="isLoading" />
    <div v-else>
      <NavBar />
      <div>
        <div class="full-screen">
          <div class="content">
            <p class="title">DISEÑO DE FORMULARIO</p>
            <div class="container-form">
              <form @submit.prevent="handleSubmit">
                <div class="add-container">
                  <button type="button" class="is-add" @click="addField">
                    Agregar Fila
                  </button>
                </div>

                <div
                  v-for="(field, index) in formFields"
                  :key="index"
                  class="form-row dotted-border"
                >
                  <div class="form-column">
                    <label :for="'tag' + index" class="label">Etiqueta*</label>
                    <input
                      type="text"
                      :id="'tag' + index"
                      class="input"
                      placeholder="Etiqueta"
                      v-model="field.tag"
                    />
                  </div>
                  <div class="form-column">
                    <label :for="'type' + index" class="label"
                      >Tipo de campo*</label
                    >
                    <select
                      :id="'type' + index"
                      class="select-input"
                      v-model="field.type"
                    >
                      <option value="text">Texto</option>
                      <option value="alfanumerico">Alfanumerico</option>
                      <option value="url">URL/Enlace</option>
                      <option value="tel">Teléfono</option>
                      <option value="number">Número</option>
                      <option value="date">Fecha</option>
                      <option value="email">Correo</option>
                    </select>
                  </div>
                  <div class="form-column check check-required">
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        :id="'isInQr' + index"
                        v-model="field.isInQr"
                      />
                      Ver en QR
                    </label>
                  </div>
                  <div class="form-column check">
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        :id="'isInCard' + index"
                        v-model="field.isInCard"
                      />
                      En Credencial
                    </label>
                  </div>
                  <div class="form-column check">
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        :id="'isRequired' + index"
                        v-model="field.isRequired"
                      />
                      Obligatorio
                    </label>
                  </div>
                  <div class="form-column delete-column check">
                    <button
                      type="button"
                      class="delete-btn"
                      @click="removeField(index)"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <div class="btns-container">
                  <button type="submit" class="button is-save">Guardar</button>
                  <button type="button" class="button is-cancel">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  registerClientForm,
  getForm,
  updateClientForm,
} from "~/services/ServiceAdmin";
import Swal from "sweetalert2";
import CredentialLoader from "~/components/loader.vue";

export default {
  components: {
    CredentialLoader,
  },
  name: "ClientForm",
  data() {
    return {
      formFields: [],
      deletedFields: [],
      isLoading: false,
    };
  },
  methods: {
    goToCapturistList() {
      this.$router.push("./CapturistList");
    },
    async handleSubmit() {
      if (this.formFields.length < 1) {
        alert("Debe de registrar al menos un dato.");
        return;
      }
      // Validar que todos los campos tengan tag y tipo seleccionado
      for (let field of this.formFields) {
        if (!field.tag || !field.type) {
          alert(
            "Por favor, complete todos los campos con una etiqueta y tipo."
          );
          return;
        }
      }

      const fieldsToUpdate = [];
      const fieldsToCreate = [];

      this.formFields.forEach((field) => {
        if (field.fieldId) {
          fieldsToUpdate.push({
            fieldId: field.fieldId,
            tag: field.tag,
            type: field.type,
            isInQr: field.isInQr,
            isInCard: field.isInCard,
            isRequired: field.isRequired,
          });
        } else {
          fieldsToCreate.push({
            tag: field.tag,
            type: field.type,
            isInQr: field.isInQr,
            isInCard: field.isInCard,
            isRequired: field.isRequired,
          });
        }
      });

      try {
        this.isLoading = true;

        if (fieldsToCreate.length > 0) {
          const institutionId = parseInt(localStorage.getItem("institutionId"));
          await registerClientForm(fieldsToCreate, institutionId);
        }

        if (fieldsToUpdate.length > 0) {
          await updateClientForm(fieldsToUpdate);
        }

        if (this.deletedFields.length > 0) {
        }
        this.isLoading = false;
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Formulario procesado exitosamente",
          confirmButtonText: "Aceptar",
        });
        this.goToCapturistList();
      } catch (e) {
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al procesar formulario",
          confirmButtonText: "Aceptar",
        });
      }
      this.resetForm();
    },

    addField() {
      this.formFields.push({
        tag: "",
        type: "text",
        isRequired: false,
        isInQr: false,
        isInCard: false,
      });
    },

    removeField(index) {
      const field = this.formFields[index];
      if (field.fieldId) {
        this.deletedFields.push(field.fieldId);
      }
      this.formFields.splice(index, 1);
    },

    resetForm() {
      this.formFields = [
        {
          tag: "",
          type: "text",
          isRequired: false,
          isInQr: false,
          isInCard: false,
        },
      ];
    },
  },
  async mounted() {
    const response = await getForm();

    if (response.data !== "No hay formulario.") {
      const data = response.data;

      data.userInfo.forEach((item, index) => {
        this.formFields.push({
          fieldId: data.fields[index].institutionCapturistFieldId,
          tag: item.tag,
          type: item.type,
          isRequired: data.fields[index].required,
          isInQr: item.inQr,
          isInCard: item.inCard,
        });
      });
    } else {
      this.formFields.push({
        tag: "",
        type: "text",
        isRequired: false,
        isInQr: false,
        isInCard: false,
      });
    }
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  overflow: hidden;
  overflow-y: hidden;
}

.full-screen {
  min-height: calc(100vh - 75px);
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
  max-height: calc(100vh - 75px);
}

.check {
  margin-top: 40px;
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
  padding: 10px;
  box-sizing: border-box;
}

label {
  font-weight: bold;
  color: black;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #e0e0e0;
  color: black;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.select-input {
  width: 100%;
  height: 40px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #e0e0e0;
  color: black;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

input::placeholder {
  color: #888;
}

.columns {
  margin-bottom: 20px;
}

.column {
  display: flex;
  flex-direction: column;
}

.button {
  width: 180px;
  height: 35px;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  border: none;
  padding: 0;
  text-align: center;
  margin: 10px 0;
}

.add-container {
  display: flex;
  justify-content: center;
}

.is-add {
  width: 180px;
  height: 35px;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  border: none;
  padding: 0;
  text-align: center;
  background-color: black;
  margin-top: 7px;
  margin-bottom: 10px;
}

.is-save {
  background-color: black;
}

.is-cancel {
  background-color: #87342c;
}

.form-row {
  margin: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: space-between;
}

.btns-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5%;
  flex-wrap: wrap;
}

.is-multiline {
  display: flex;
  flex-wrap: wrap;
}

.checkbox input {
  width: 25px;
  height: 25px;
  background-color: black;
  border-radius: 5px;
  border: 2px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #e0e0e0;
}

.checkbox input:checked {
  background-color: #007bff;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
}

.checkbox {
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  cursor: pointer;
  color: black;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  margin: 0;
}

.delete-btn:hover {
  color: #ff0000;
}

.fa-trash {
  font-size: 20px;
}

.five {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
}

form-column {
  flex: 1 1 calc(16.66% - 10px);
  min-width: 150px;
}

.delete-column {
  flex: 0 0 40px;
  text-align: center;
}

.dotted-border {
  border: 2px dashed #ccc;
  padding: 5px;
  width: 100%;
  text-align: center;
  border-radius: 8px;
}

@media (max-width: 1024px) {
  .form-column {
    flex: 1 1 calc(33.33% - 10px);
  }

  .check {
    margin-top: 5px;
  }

  .check-required {
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .form-column {
    flex: 1 1 calc(50% - 10px);
  }

  .check {
    margin-top: 5px;
  }
}

@media (max-width: 480px) {
  .form-column {
    flex: 1 1 100%;
  }

  .check {
    margin-top: 5px;
  }
}
</style>
