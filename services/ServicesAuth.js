import axios from "axios";
import BASEURL from "~/utils/properties";

export const loginMethod = async (data) => {
  try {
    const response = await axios.post(`${BASEURL}login`, data);

    const { institutionId, email, token, userId } = response.data;

    localStorage.setItem("institutionId", institutionId);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    axios.defaults.headers.common["Authorization"] = `${token}`;

    return response.data;
  } catch (e) {
    console.error("Error en la petición de login:", e);
    throw new Error("Credenciales inválidas.");
  }
};
export const sendVerificationCode = async (data) => {
  try {
    const response = await axios.post(
      `${BASEURL}api/recovery-password/send-verification-code`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar el código de verificación:", error);
    throw new Error("No se pudo enviar el código de verificación.");
  }
};
export default {
  async validateVerificationCode(code, userEmail) {
    const url = `${BASEURL}api/recovery-password/validate-verification-code`;
    const payload = { code, userEmail };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al validar el código.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en validateVerificationCode:", error);
      throw error;
    }
  },
};

export const changePassword = async (data) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.put(
      "api/recovery-password/change-password",
      data
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getProfileInformation = async () => {
  const { $axios } = useNuxtApp();
  const userId = parseInt(localStorage.getItem("userId"));
  try {
    const response = await $axios.post("api/users/get-account", {
      userId: userId,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updateProfileInformation = async (data) => {
  const { $axios } = useNuxtApp();
  const userId = parseInt(localStorage.getItem("userId"));
  let payload;
  try {
    if (data.password) {
      payload = {
        userId: userId,
        name: data.name,
        password: data.password,
      };
    } else {
      payload = {
        userId: userId,
        name: data.name,
      };
    }
    const response = await $axios.post("api/users/update-data", payload);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getQrData = async (id) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.get(`api/credentials/get-qr-data/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
