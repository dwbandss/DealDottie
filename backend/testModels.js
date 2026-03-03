const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY; // make sure it's loaded

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );

    console.log("Available Models:\n");
    
    response.data.models.forEach(model => {
      console.log("Name:", model.name);
      console.log("Supported methods:", model.supportedGenerationMethods);
      console.log("----");
    });

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

listModels();