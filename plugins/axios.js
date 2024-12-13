import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: "http://98.83.97.145:8081/",
  });

  const { $toast } = useNuxtApp();

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      const status = error.response?.status;

      switch (status) {
        case 400:
          $toast.error(
            "Solicitud inválida. Por favor, revisa los datos enviados."
          );
          break;
        case 401:
          $toast.warning("No autorizado. Redirigiendo al inicio de sesión...");
          nuxtApp.$router.push("/");
          break;
        case 403:
          $toast.error("No tienes permiso para realizar esta acción.");
          break;
        case 404:
          $toast.info("El recurso solicitado no fue encontrado.");
          break;
        case 500:
          $toast.error(
            "Error interno del servidor. Intenta de nuevo más tarde."
          );
          break;
        default:
          $toast.error("Ocurrió un error inesperado.");
          break;
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
