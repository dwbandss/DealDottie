function rankGroupedProducts(groupedProducts) {

  return groupedProducts.map(product => {

    product.offers.sort((a, b) => {
      return a.price - b.price;
    });

    return product;
  });
}

module.exports = rankGroupedProducts;