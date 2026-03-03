const axios = require("axios");

exports.detectProduct = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No image received"
      });
    }

    const base64Image =
      req.file.buffer.toString("base64");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role : "user",
            parts: [
              {
                text: "Identify the exact product model in this image. Return ONLY the product name suitable for marketplace search."
              },
              {
                inline_data: {
                  mime_type: req.file.mimetype,
                  data: base64Image
                }
              }
            ]
          }
        ]
      }
    );

    const detected =
      response.data.candidates[0]
        .content.parts[0].text.trim();

    return res.json({ query: detected });

  } catch (err) {

    console.error(
      "Gemini Vision Error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      error: "Gemini detection failed"
    });
  }
};