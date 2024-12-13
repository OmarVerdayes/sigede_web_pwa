import { decodeToken } from "~/utils/tokenUtils";

export default defineNuxtRouteMiddleware((to, from) => {
  // Validar que el middleware solo se ejecute en el cliente
  if (process.client) {
    const publicRoutes = [
      "/",
      "/auth/ResetPassword",
      "/auth/SendEmail",
      "/auth/VerificationCode",
      "/public/screens/vista_QR**",
    ];

    const isPublic = publicRoutes.some((route) => {
      const regex = new RegExp("^" + route.replace("**", ".*") + "$");
      return regex.test(to.path);
    });

    if (isPublic) {
      return; // Permitir navegación
    }
    // Obtener el valor del token de localStorage
    const token = localStorage.getItem("token");

    // Validar que el token existe
    if (!token) {
      console.warn("No se encontró el token en localStorage");
      return navigateTo("/");
    }

    try {
      const decodedToken = decodeToken(token);

      // Definir los roles válidos
      type Role = "SUPERADMIN" | "ADMIN" | "CAPTURISTA";

      // Decodificar el token y obtener el rol
      const roles: Role = decodedToken.roles[0] as Role;
      if (process.client) {
        localStorage.setItem("role", decodedToken.roles[0]);
      }

      // Definir las rutas principales de cada rol
      const roleRoutes: Record<Role, string[]> = {
        SUPERADMIN: [
          "/superadmins/screens/OrganizationsList",
          "/superadmins/screens/SomeOtherRoute",
          "/auth/Profile",
        ],
        ADMIN: [
          "/admins/screens/CapturistList",
          "/admins/screens/AnotherRoute",
          "/auth/Profile",
        ],
        CAPTURISTA: [
          "/capturists/screens/CredentialsList",
          "/capturists/screens/OtherCapturistRoute",
          "/capturists/screens/EditCredential",
          "/auth/Profile",
        ],
      };

      // Obtener las rutas permitidas para el rol
      const allowedRoutes = roleRoutes[roles];

      if (!allowedRoutes) {
        console.warn("El rol no tiene rutas permitidas");
        return navigateTo("/");
      }

      // Validar si la ruta actual está dentro de las rutas permitidas para ese rol
     const isAllowed = allowedRoutes.some(route => to.path.startsWith(route));

      if (isAllowed) {
        return; // Permitir navegación
      }

      // Si la ruta no es válida, redirigir a la primera ruta permitida del rol
      //return navigateTo(allowedRoutes[0]);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      localStorage.removeItem("token");
      return navigateTo("/");
    }
  }
});
