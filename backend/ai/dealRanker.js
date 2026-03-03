function rankDealsIndia(products) {

  if (!products.length) return [];

  const avgPrice =
    products.reduce((a, p) => a + p.price, 0)
    / products.length;

  return products.map(p => {

    let score = 0;

    score += Math.min(p.reviews / 100, 50);
    score += (p.rating || 4) * 8;

    if (avgPrice > 0) {
      score += ((avgPrice - p.price) / avgPrice) * 30;
    }

    if (/amazon|flipkart/i.test(p.seller))
      score += 10;

    return {
      ...p,
      dealScore: Math.round(score),
      verdict:
        score > 90 ? "🔥 Best Deal" :
        score > 70 ? "✅ Great Deal" :
        score > 50 ? "👍 Good Deal" :
        "⚠ Consider Carefully"
    };

  }).sort((a, b) => b.dealScore - a.dealScore);
}

module.exports = rankDealsIndia;