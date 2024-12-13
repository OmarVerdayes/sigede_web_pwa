<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoading" />
    <div v-else>
      <NavBar />
      <div class="content">
        <p class="title">VISUALIZACION QR</p>
        <div class="container-form">
          <div class="form-row">
            <div class="form-column user-info">
              <h2><strong>Nombre:</strong> {{ credential.fullname }}</h2>
              <div v-if="credential.fields && credential.fields.length">
                <div v-for="(field, index) in credential.fields" :key="index">
                  <p>
                    <strong>{{ field.tag }}:</strong> {{ field.value }}
                  </p>
                </div>
              </div>
              <p v-else class="empty-message">No hay datos disponibles.</p>
            </div>

            <div class="image-column">
              <figure class="image-container">
                <img
                  class="is-rounded"
                  :src="credential.userPhoto"
                  alt="Foto de perfil"
                />
              </figure>
              <div class="vigencia">
                <p>Vigencia</p>
                <span class="vigencia-date">{{
                  credential.expirationDate
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CredentialLoader from "~/components/loader.vue";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { getQrData } from "~/services/ServicesAuth";

const route = useRoute();
const credential = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  const id = route.query.id;
  if (id) {
    const response = await getQrData(id);

    if (response.status == 200) {
      credential.value = response.data;
      isLoading.value = false;
    } else {
      isLoading.value = false;
    }
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  margin: 10px 0;
  text-align: center;
  color: black;
  text-decoration: underline;
  font-size: 28px;
  font-weight: 400;
}

.container-form {
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

.form-column {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
}

.image-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  text-align: left;
}

.user-info p,
.user-info h2 {
  margin: 8px 0;
  color: #333333;
  text-align: left;
}

.user-info h2 {
  font-size: 20px;
  font-weight: bold;
}

.user-info strong {
  color: #000000 !important;
}

.empty-message {
  color: #555555;
  font-style: italic;
}

.vigencia {
  text-align: center;
  margin-top: 15px;
}

.vigencia-date {
  display: inline-block;
  background-color: #f6b145;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .container-form {
    padding: 15px;
  }

  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .title {
    font-size: 24px;
  }

  .image-container {
    width: 120px;
    height: 120px;
  }

  .vigencia-date {
    font-size: 14px;
    padding: 5px;
  }
}
</style>
