<template>
  <div>
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#000000" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { syncPendingCapturists } from './services/ServiceAdmin';

onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service Worker registrado:', registration);
    }).catch((error) => {
      console.error('Error al registrar el Service Worker:', error);
    });
  }

  // Verificar si hay conexión a Internet
  if (navigator.onLine) {
    console.log('Conexión a Internet disponible. Sincronizando datos...');
    syncPendingCapturists();
  } else {
    console.log('Sin conexión a Internet. Los datos se sincronizarán cuando haya conexión.');
  }
});
</script>

<style>
body {
  background-color: #e4e4e4;
  margin: 0;
  height: 100vh;
}
</style>
