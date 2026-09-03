export const uploadToCloudinary = async (file, setUploading) => {
  try {
    if (!file) throw new Error("No file selected");

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG/PNG images are allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File size should be less than 2MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
    );

    setUploading(true);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Invalid response from Cloudinary");
    }

    return {
      url: data.secure_url,
      public_id: data.public_id, 
    };
  } catch (error) {
    console.error("Cloudinary Error:", error.message);
    throw error;
  } finally {
    setUploading(false);
  }
};