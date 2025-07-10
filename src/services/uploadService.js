const cloudinary = require("../../config/cloudinary");

const uploadSingleImage = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce", resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Error in uploadSingleImage:", {
            message: error.message,
          });
          return reject({
            status: "error",
            message: "Failed to upload image",
            error: error.message,
            data: null,
          });
        }
        resolve({
          status: "success",
          message: "Image uploaded successfully",
          error: null,
          data: { url: result.secure_url },
        });
      }
    );
    stream.end(file.buffer);
  });
};

const uploadMultipleImages = (files) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadPromises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "ecommerce", resource_type: "image" },
              (error, result) => {
                if (error) {
                  return reject(error);
                }
                resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      );

      const urls = await Promise.all(uploadPromises);
      resolve({
        status: "success",
        message: "Images uploaded successfully",
        error: null,
        data: { urls },
      });
    } catch (error) {
      console.error("Error in uploadMultipleImages:", {
        message: error.message,
      });
      reject({
        status: "error",
        message: "Failed to upload images",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = { uploadSingleImage, uploadMultipleImages };
