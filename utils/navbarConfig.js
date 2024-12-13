export const navbarConfig = {
  ADMIN: [
    {
      name: "Formulario",
      icon: "fa-brands fa-wpforms",
      route: "/admins/screens/ClientForm",
    },
    {
      name: "Plantilla",
      icon: "fa-regular fa-file-word",
      route: "/admins/screens/ManageDocument",
    },
    {
      name: "Capturistas",
      icon: "fas fa-users",
      route: "/admins/screens/CapturistList",
    },
    { name: "Perfil", icon: "fas fa-user", route: "/auth/Profile" },
  ],
  SUPERADMIN: [
    {
      name: "Organizaciones",
      icon: "fa-solid fa-building",
      route: "/superadmins/screens/OrganizationsList",
    },
    {
      name: "Perfil",
      icon: "fas fa-user",
      route: "/auth/Profile",
    },
  ],
  CAPTURISTA: [
    {
      name: "Credenciales",
      icon: "fas fa-users",
      route: "/capturists/screens/CredentialsList",
    },
    { name: "Perfil", icon: "fas fa-user", route: "/auth/Profile" },
  ],
  DEFAULT: [{ name: "Home", icon: "fas fa-home", route: "/" }],
};
