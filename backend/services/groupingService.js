function cleanTitle(title) {
  return title
    .toLowerCase()
    .replace(/[\(\)\|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function extractBaseModel(title) {

  const cleaned = cleanTitle(title);

  // Remove storage
  const noStorage = cleaned.replace(/\d+\s?gb|\d+\s?tb/gi, "");

  // Remove colors
  const noColor = noStorage.replace(
    /(black|blue|green|white|silver|gray|grey|violet|red)/gi,
    ""
  );

  return noColor.trim();
}
function extractVariant(title) {
  const match = title.match(/(\d+\s?gb|\d+\s?tb)/i);
  return match ? match[0].toUpperCase() : "Standard";
}
function groupProducts(products) {

  const groups = {};

  products.forEach(p => {

    const base = extractBaseModel(p.title);
    const variant = extractVariant(p.title);

    const groupKey = base + "|" + variant;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        base,
        variant,
        products: []
      };
    }

    groups[groupKey].products.push(p);

  });

  return Object.values(groups);
}

module.exports = groupProducts;