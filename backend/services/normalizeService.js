function normalizeProduct(product) {

  const title = product.title.toLowerCase();

  const ramMatch = title.match(/(\d+)\s?gb/);
  const storageMatch = title.match(/(\d+)\s?gb/);

  return {
    ...product,
    seller: product.source,
    brand: title.split(" ")[0],
    ram: ramMatch ? ramMatch[0] : null,
    storage: storageMatch ? storageMatch[0] : null,
    normalizedKey: title
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 40)
  };
}

module.exports = normalizeProduct;