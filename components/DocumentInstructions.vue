<template>
  <div class="instructions">
    <h1>Instrucciones para Subir tu Plantilla</h1>
    <p>
      Para generar documentos correctamente, asegúrate de que tu plantilla
      cumpla con los siguientes requisitos:
    </p>
    <div class="requirements">
      <h2>Requisitos del Documento:</h2>
      <ul>
        <li>El documento debe estar en formato <strong>.docx</strong>.</li>
        <li>Incluye etiquetas para datos dinámicos:</li>
        <ul class="tags-list">
          <li><code>${name}</code>: Nombre del usuario.</li>
          <li><code>${expirationDate}</code>: Fecha de expiración.</li>
          <li>
            <code>${tag}</code>: Campos dinámicos de la credencial. (Reemplaza
            "tag" por los campos que registraste en tu formulario).
          </li>
        </ul>
        <li>
          Para insertar imágenes, usa marcadores de posición con texto
          alternativo:
        </li>
        <ul class="image-tags-list">
          <li><code>PERSON_IMAGE</code>: Imagen de perfil del usuario.</li>
          <li><code>QR_CODE</code>: Código QR dinámico.</li>
        </ul>
      </ul>
    </div>
    <p>Descarga este ejemplo de plantilla como referencia:</p>
    <div style="text-align: center">
      <a
        :href="sampleDocUrl"
        download="PlantillaEjemplo.docx"
        class="download-link"
      >
        Descargar Plantilla de Ejemplo
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sampleDocUrl: "/PlantillaEjemplo.docx",
    };
  },
};
</script>

<style scoped>
.instructions {
  background: #f7f9fc;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
  font-family: Arial, sans-serif;
  margin-top: 30px;
}

.instructions h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.instructions p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.requirements h2 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 0.8rem;
}

ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

ul li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
  color: #444;
}

ul li::before {
  content: "✔";
  color: #28a745;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0.2rem;
}

strong {
  color: black;
}

ul.tags-list li,
ul.image-tags-list li {
  color: #555;
}

ul.tags-list li code,
ul.image-tags-list li code {
  background-color: #eef3fc;
  color: #0056b3;
  font-family: "Courier New", Courier, monospace;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.download-link {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  background-color: black;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  text-align: center;
}

.download-link:hover {
  background-color: #003f7f;
}

@media (max-width: 768px) {
  .instructions {
    padding: 1.5rem;
  }

  .instructions h1 {
    font-size: 1.6rem;
  }

  .instructions p {
    font-size: 0.9rem;
  }

  .download-link {
    font-size: 0.9rem;
  }
}
</style>
