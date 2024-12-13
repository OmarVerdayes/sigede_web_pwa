export const ServiceCloudinary = {
    async uploadImage(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "dpkl7ms3o-sigede");

        try {
            // Hacer la solicitud usando fetch
            const response = await fetch("https://api.cloudinary.com/v1_1/dpkl7ms3o/image/upload", {
                method: "POST",
                body: formData, // Agregar formData al cuerpo de la solicitud
                headers: {
                    // No incluir el encabezado Authorization
                    // Si necesitas agregar otros encabezados, puedes hacerlo aquí
                },
            });

            if (!response.ok) {
                throw new Error(`Error al subir imagen: ${response.statusText}`);
            }

            const data = await response.json();
            return data.secure_url; // Retorna la URL segura de la imagen subida
        } catch (error) {
            console.error("Error al subir imagen a Cloudinary:", error);
            throw error;
        }
    },
};

