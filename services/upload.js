import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default  uploadToCloudinary = async (req) => {
  const form = formidable({ multiples: false }); // Permite solo un archivo

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject({ success: false, message: "Error al procesar el archivo", error: err });
        return;
      }

      // Verificar que se haya subido un archivo
      if (!files.file) {
        reject({ success: false, message: "No se encontró un archivo para subir" });
        return;
      }

      try {
        // Subir el archivo a Cloudinary
        const result = await cloudinary.uploader.upload(files.file.filepath);

        // Retornar solo la URL de la imagen
        resolve({ success: true, imageUrl: result.secure_url });
      } catch (uploadError) {
        reject({ success: false, message: "Error al subir a Cloudinary", error: uploadError });
      }
    });
  });
};
