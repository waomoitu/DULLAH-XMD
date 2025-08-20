// lib/removebg.js
const axios = require("axios");
const FormData = require("form-data");

async function removeBg(imageBuffer, apiKey) {
  try {
    const formData = new FormData();
    formData.append("image_file", imageBuffer, {
      filename: "image.png", // jina tu, sio lazima iwepo file
    });
    formData.append("size", "auto");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    if (response.status !== 200) {
      return `❌ Remove.bg API Error: ${response.statusText}`;
    }

    return Buffer.from(response.data, "binary");
  } catch (err) {
    console.error("❌ RemoveBg Error:", err.response?.data || err.message);
    return (
      "❌ Failed to remove background.\n" +
      (err.response?.data ? err.response.data.toString() : err.message)
    );
  }
}

module.exports = { removeBg };
