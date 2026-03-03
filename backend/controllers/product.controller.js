const axios = require("axios");
const rankDealsIndia = require("../ai/dealRanker");
const normalizeQuery = require("../ai/queryBrain");
const filterProducts = require("../ai/productMatcher");

/* =========================================
SMART SEARCH CONTROLLER
========================================= */

exports.searchProducts = async (req, res) => {

  try {

    const rawQuery = req.query.query;
    const selectedVariant = req.query.variant;

    if (!rawQuery)
      return res.status(400).json({
        error: "Query missing"
      });

    const query = normalizeQuery(rawQuery);
console.log("RAW QUERY:", rawQuery);
console.log("SELECTED VARIANT:", selectedVariant);
    /* =========================================
    FETCH REAL MARKETPLACE DATA (SERP API)
    ========================================= */

    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google_shopping",
          q: rawQuery,
          api_key: process.env.SERP_API_KEY,
          gl: "in",       // India
          hl: "en"
        }
      }
    );

    const results =
      response.data.shopping_results || [];

    if (!results.length)
      return res.json({ products: [] });

    /* =========================================
    FORMAT PRODUCTS
    ========================================= */

    let products = results.map(p => ({

      title: p.title,
      price: parseInt(
        p.price?.replace(/[^\d]/g, "")
      ) || 0,

      rating: p.rating || 4,
      reviews: p.reviews || 0,
      seller: p.source || "Unknown",
      image: p.thumbnail || "",
      link: p.link || ""

    }));

    /* =========================================
    DYNAMIC VARIANT DETECTION
    ========================================= */

    const variantKeywords = [
      "pro", "max", "plus", "ultra",
      "256gb", "512gb", "128gb",
      "8gb", "12gb", "16gb"
    ];

    const detectedVariants = new Set();

    products.forEach(p => {
      variantKeywords.forEach(v => {
        if (p.title.toLowerCase().includes(v)) {
          detectedVariants.add(v.toUpperCase());
        }
      });
    });

    /* Ask user for variant if device-like product */
    if (!selectedVariant &&
        detectedVariants.size > 0 &&
        /phone|iphone|samsung|laptop|macbook|ipad|tablet/i.test(query)) {

      return res.json({
        askVariant: true,
        variants: Array.from(detectedVariants)
      });
    }

    /* =========================================
    STRICT VARIANT FILTERING
    ========================================= */

    if (selectedVariant) {
      products = products.filter(p =>
        p.title.toLowerCase()
          .includes(selectedVariant.toLowerCase())
      );
    }

    /* =========================================
    MATCH FILTER (INTENT ACCURACY)
    ========================================= */

    products =
      filterProducts(products, rawQuery);

    /* =========================================
    INDIA-BIASED RANKING
    ========================================= */

    const ranked =
      rankDealsIndia(products);

    return res.json({
      products: ranked
    });

  }
  catch (err) {

    console.error("SEARCH ENGINE ERROR:",
      err.message);

    return res.status(500).json({
      error: "Marketplace engine failed"
    });
  }
};