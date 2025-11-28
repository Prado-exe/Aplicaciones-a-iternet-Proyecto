const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// Configuración de Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage de multer que sube directamente a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/"); //usamos mimetype para diferenciar entre imagen y archivo
    //Condicionamos segun lo anterior
    if (isImage) {
      return {
        folder: "fablab_proyectos/imagenes",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }
    return {
      folder: "fablab_proyectos/archivos",
      resource_type: "raw",
    };
  },
});

// Este ES el middleware que se usa en las rutas
const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload,
};
