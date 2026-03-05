const axios = require("axios");
const rankDeals = require("../ai/dealRanker");

/* ================================
DYNAMIC SPEC EXTRACTION (GENERIC)
================================ */

function extractSpecs(title) {

  const lower = title.toLowerCase();

  const ramMatch = lower.match(/(\d+)\s?gb\s?ram/);
  const storageMatch = lower.match(/(\d+)\s?gb(?!\s?ram)/);
  const sizeMatch = lower.match(/(\d+(\.\d+)?)\s?(inch|cm)/);
  const colorMatch = lower.match(
    /black|white|blue|green|grey|silver|gold|red|pink|purple/
  );

  return {
    ram: ramMatch ? ramMatch[1] + "GB" : null,
    storage: storageMatch ? storageMatch[1] + "GB" : null,
    size: sizeMatch ? sizeMatch[0] : null,
    color: colorMatch ? colorMatch[0] : null
  };
}

exports.searchProducts = async (req, res) => {

  try {

    const query = req.query.query;

    if (!query)
      return res.status(400).json({ error: "Query missing" });

    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google_shopping",
          q: query,
          api_key: process.env.SERP_API_KEY,
          gl: "in",
          hl: "en"
        }
      }
    );

    const results =
      response.data.shopping_results || [];

    if (!results.length)
      return res.json({ products: [] });

    let products = results.map(p => {

      const specs = extractSpecs(p.title);

      return {
        title: p.title,
        price: p.price
          ? parseInt(String(p.price).replace(/[^\d]/g,""))
          : 0,
        rating: p.rating ? Number(p.rating) : null,
        reviews: p.reviews || 0,
        seller: p.source || "Unknown",
        image: p.thumbnail || "",
        link: p.link && p.link.startsWith("http")
          ? p.link
          : null,
        ...specs
      };
    });

    let ranked = rankDeals(products);

    /* Enforce review credibility for top 3 */
    ranked = ranked.filter((p, index) => {
      if(index < 3){
        return (p.reviews || 0) >= 1;
      }
      return true;
    });

    ranked = ranked.slice(0, 5);

    /* ================================
    GENERATE FILTERS
    ================================ */

    const filters = {
      sellers: [...new Set(ranked.map(p=>p.seller))],
      ram: [...new Set(ranked.map(p=>p.ram).filter(Boolean))],
      storage: [...new Set(ranked.map(p=>p.storage).filter(Boolean))],
      size: [...new Set(ranked.map(p=>p.size).filter(Boolean))],
      color: [...new Set(ranked.map(p=>p.color).filter(Boolean))]
    };

    return res.json({
      products: ranked,
      filters
    });

  }
  catch (err) {

    console.error(err.message);

    return res.status(500).json({
      error: "Marketplace engine failed"
    });
  }
};