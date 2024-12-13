<template>
  <div class="full-screen">
    <NavBar />
    <div class="content">
      <p class="title">PERFIL</p>
      <div class="form-container">
        <form @submit.prevent="showAlert">
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="name" :class="{ 'error-label': errors.name }"
                  >Nombre *</label
                >
                <input
                  id="name"
                  type="text"
                  v-model="form.name"
                  :class="['form-control', { error: errors.name }]"
                  placeholder="Nombre completo"
                  :disabled="states.isEdited"
                />
                <small v-if="errors.name" class="error-message">{{
                  errors.name
                }}</small>
              </div>

              <div class="form-group">
                <label for="email" :class="{ 'error-label': errors.email }"
                  >Correo de contacto *</label
                >
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  disabled
                  :class="['form-control', { error: errors.email }]"
                  placeholder="Correo de contacto"
                />
                <small v-if="errors.email" class="error-message">{{
                  errors.email
                }}</small>
              </div>

              <div class="form-group">
                <label
                  for="password"
                  :class="{ 'error-label': errors.password }"
                  >Contraseña *</label
                >
                <div class="password-container">
                  <input
                    :type="states.showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="form.password"
                    :class="['form-control', { error: errors.password }]"
                    placeholder="********"
                    :disabled="states.isEdited"
                  />
                  <span class="eye-icon" @click="togglePasswordVisibility">
                    <i
                      :class="
                        states.showPassword
                          ? 'fa-regular fa-eye'
                          : 'fa-regular fa-eye-slash'
                      "
                      style="color: #030303"
                    ></i>
                  </span>
                </div>
                <small v-if="errors.password" class="error-message">{{
                  errors.password
                }}</small>
              </div>

              <div v-if="states.showInput" class="form-group">
                <label
                  for="confirm-password"
                  :class="{ 'error-label': errors.confirmPassword }"
                  >Confirmar contraseña *</label
                >
                <div class="password-container">
                  <input
                    :type="states.showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    v-model="form.confirmPassword"
                    :class="['form-control', { error: errors.confirmPassword }]"
                    placeholder="********"
                  />
                  <span
                    class="eye-icon"
                    @click="toggleConfirmPasswordVisibility"
                  >
                    <i
                      :class="
                        states.showConfirmPassword
                          ? 'fa-regular fa-eye'
                          : 'fa-regular fa-eye-slash'
                      "
                      style="color: #030303"
                    ></i>
                  </span>
                </div>
                <small v-if="errors.confirmPassword" class="error-message">{{
                  errors.confirmPassword
                }}</small>
              </div>

              <div class="buttons">
                <button type="submit" class="submit-btn" @click="toggleEditing">
                  {{ states.isEditing ? "Guardar cambios" : "Editar perfil" }}
                </button>
                <button class="cancel-btn" @click="handleCancel">
                  Cancelar
                </button>
              </div>
            </div>

            <div class="image-column">
              <img src="/shield-icon.png" alt="profile" class="profile-image" />
            </div>
          </div>
        </form>
        <div class="btn-logout-container">
          <button type="button" class="logout-btn" @click="handleLogout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
    <CustomAlert
      v-if="showCustomAlert"
      :title="alertTitle"
      :message="alertMessage"
      :confirm-text="alertConfirmText"
      @confirm="handleConfirm"
      @cancel="handleCancelAlert"
    />
  </div>
</template>

<script setup>
import CustomAlert from "~/components/CustomAlert.vue";
import {
  getProfileInformation,
  updateProfileInformation,
} from "~/services/ServicesAuth";
import { reactive, ref, onMounted } from "vue";

const { $toast, $router } = useNuxtApp();

const states = reactive({
  showPassword: false,
  showConfirmPassword: false,
  isEdited: true,
  isEditing: false,
  showInput: false,
});

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const originalForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  name: null,
  email: null,
  password: null,
  confirmPassword: null,
});

const showCustomAlert = ref(false);
const alertTitle = ref("");
const alertMessage = ref("");
const alertConfirmText = ref("");

const togglePasswordVisibility = () => {
  states.showPassword = !states.showPassword;
};

const toggleConfirmPasswordVisibility = () => {
  states.showConfirmPassword = !states.showConfirmPassword;
};

const validateForm = () => {
  errors.name = null;
  errors.email = null;
  errors.password = null;
  errors.confirmPassword = null;

  let isValid = true;

  if (!form.name) {
    errors.name = "El nombre es obligatorio.";
    isValid = false;
  }

  if (!form.email) {
    errors.email = "El correo es obligatorio.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "El correo no tiene un formato válido.";
    isValid = false;
  }

  if (
    form.password &&
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{8,}$/.test(
      form.password
    )
  ) {
    errors.password =
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
    isValid = false;
  }

  if (form.password && !form.confirmPassword) {
    errors.confirmPassword = "Debes de confirmar tu contraseña.";
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
    isValid = false;
  }

  return isValid;
};

const toggleEditing = () => {
  if (states.isEditing) {
    if (validateForm()) {
      alertTitle.value = "ADVERTENCIA";
      alertMessage.value = `¿Estás seguro de actualizar la información de tu perfil?`;
      alertConfirmText.value = "Actualizar";
      showCustomAlert.value = true;
    }
  } else {
    Object.assign(originalForm, { ...form });
    states.isEditing = true;
    states.isEdited = false;
    states.showInput = true;
  }
};

const handleUpdateProfile = async () => {
  const data = {
    name: form.name,
    password: form.password,
  };

  const response = await updateProfileInformation(data);

  if (response.status == 200) {
    $toast.success("Información actualizada correctamente");
  }
};

const handleConfirm = () => {
  handleUpdateProfile();
  states.isEditing = false;
  states.isEdited = true;
  states.showInput = false;
  showCustomAlert.value = false;
};

const handleCancelAlert = () => {
  showCustomAlert.value = false;
};

const handleCancel = () => {
  Object.assign(form, { ...originalForm });
  states.isEditing = false;
  states.isEdited = true;
  states.showInput = false;
};

const handleGetProfileInformation = async () => {
  const response = await getProfileInformation();
  form.email = response.data.email;
  form.name = response.data.name;
};

const handleLogout = () => {
  localStorage.clear();
  $router.push("/");
};

onMounted(() => {
  handleGetProfileInformation();
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

.form-column,
.image-column {
  flex: 1 1 100%;
  padding: 20px;
}

.image-column {
  display: flex;
  justify-content: center;
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

.profile-image {
  max-width: 80%;
  max-height: 250px;
  height: auto;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 60px;
}

.submit-btn,
.cancel-btn,
.logout-btn {
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

.cancel-btn {
  background-color: #87342c;
}

.logout-btn {
  background-color: red;
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

label {
  font-weight: bold;
  color: black;
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

label.error-label {
  color: red;
}

.eye-icon {
  position: absolute;
  right: 15px;
  top: 40%;
  transform: translateY(-50%);
  cursor: pointer;
}

.password-container {
  position: relative;
  width: 100%;
}

.btn-logout-container {
  text-align: center;
  margin-top: 20px;
}
</style>
