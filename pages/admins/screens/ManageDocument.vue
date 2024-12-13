<template>
  <div class="full-screen">
    <NavBar />
    <div class="content">
      <p class="title">SUBIR DOCUMENTO</p>
      <div class="form-container">
        <div v-if="existingDocument">
          <p>
            Ya existe un documento cargado. Puedes descargarlo o subir uno
            nuevo:
            <a
              :href="existingDocument"
              download="Plantilla.docx"
              class="download-link"
            >
              Descargar Documento Actual
            </a>
          </p>
          <form @submit.prevent="handleSubmit" class="replace-form">
            <div class="form-group">
              <label for="file-upload-replace" class="form-label">
                Subir un nuevo documento
              </label>
              <input
                id="file-upload-replace"
                type="file"
                @change="handleFileChange"
                class="form-control"
              />
              <small v-if="errors.file" class="error-message">{{
                errors.file
              }}</small>
            </div>
            <div style="text-align: center">
              <button type="submit" class="submit-btn" :disabled="disabled">
                Reemplazar Documento
              </button>
            </div>
          </form>
        </div>

        <div v-else>
          <p>No hay documento cargado. Sube uno nuevo:</p>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="file-upload" :class="{ 'error-label': errors.file }"
                >Archivo *</label
              >
              <input
                id="file-upload"
                type="file"
                @change="handleFileChange"
                :class="['form-control', { error: errors.file }]"
              />
              <small v-if="errors.file" class="error-message">{{
                errors.file
              }}</small>
            </div>
            <div style="text-align: center">
              <button type="submit" class="submit-btn" :disabled="disabled">
                Subir
              </button>
            </div>
          </form>
        </div>
        <DocumentInstructions />
      </div>
    </div>
  </div>
</template>

<script setup>
import DocumentInstructions from "~/components/DocumentInstructions.vue";
import { reactive, ref, onMounted } from "vue";
import {
  getInstitutionDocument,
  uploadDocument,
} from "~/services/ServiceAdmin";

const errors = reactive({
  file: "",
});

const { $toast } = useNuxtApp();

const fileInput = ref(null);
const existingDocument = ref(null);
const disabled = ref(true);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    errors.file = "Por favor, selecciona un archivo.";
    return;
  }

  if (
    file.type !==
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    errors.file = "El archivo debe ser de tipo .docx";
    return;
  }

  fileInput.value = file;
  errors.file = "";
  disabled.value = false;
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("docs", fileInput.value);
  const response = await uploadDocument(formData);
  if (response.success) {
    $toast.success("Documento guardado correctamente.");
  }
};

onMounted(async () => {
  const response = await getInstitutionDocument();

  if (response.document) {
    const blob = new Blob([new Uint8Array(response.document)], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    existingDocument.value = url;
  }
});
</script>

<style scoped>
.full-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #e4e4e4;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  color: black;
  text-decoration: underline;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0.15em;
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

.form-control[type="file"] {
  padding: 5px;
  background-color: #f5f5f5;
}

.buttons {
  display: flex;
  justify-content: center;
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
  width: 43%;
}

.submit-btn {
  background-color: black;
}

.submit-btn:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-btn {
  background-color: #87342c;
}

.form-container {
  border-radius: 8px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  padding: 3%;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 90vh;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.form-column {
  flex: 1 1 100%;
  padding: 20px;
}
label {
  font-weight: bold;
  color: black;
}

.error-message {
  color: red;
  font-size: 12px;
  display: block;
}

label.error-label {
  color: red;
}

.download-link:hover {
  background-color: #003f7f;
}

@media (max-width: 768px) {
  .download-link {
    font-size: 0.9rem;
  }
}
</style>
