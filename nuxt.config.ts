export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  build: {
    transpile: ["vue-toastification"],
  },
  devtools: { enabled: false },
  css: ["bulma/css/bulma.css"],
  plugins: ["~/plugins/toastification.js", "~/plugins/axios.js"],
  modules: ["@nuxtjs/cloudinary", "@nuxt/image"],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    useComponent: true,
  },
  runtimeConfig: {
    public: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    },
  },
  image: {
    cloudinary: {
      baseURL: "https://res.cloudinary.com/dpkl7ms3o/image/upload/",
    },
    domains: ["res.cloudinary.com"],
  },
  vite: {
    optimizeDeps: {
      include: ["@unpic/vue", "@cloudinary-util/url-loader"],
    },
  },
});
