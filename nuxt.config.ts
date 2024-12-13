export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  build: {
    transpile: ["vue-toastification"],
  },
  devtools: { enabled: false },
  css: ["bulma/css/bulma.css"],
  plugins: ["~/plugins/toastification.js", "~/plugins/axios.js", "~/plugins/service-worker.js"],
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
  app: {
    head: {
      link: [
        {
          rel: "manifest",
          href:"/manifest.json",
        },
      ],
      meta: [
        { name: "theme-color", content: "#000000" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "balck" },
      ]
    }
  }
});
