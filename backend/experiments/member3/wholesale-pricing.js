const wholesaleTiers = [
  {
    maxPrice: 999,
    tiers: [
      { minQuantity: 50, discount: 5 },
      { minQuantity: 100, discount: 10 },
      { minQuantity: 200, discount: 15 },
    ],
  },
  {
    maxPrice: 4999,
    tiers: [
      { minQuantity: 20, discount: 5 },
      { minQuantity: 40, discount: 10 },
      { minQuantity: 80, discount: 15 },
    ],
  },
  {
    maxPrice: 19999,
    tiers: [
      { minQuantity: 10, discount: 5 },
      { minQuantity: 20, discount: 10 },
      { minQuantity: 40, discount: 15 },
    ],
  },
  {
    maxPrice: 49999,
    tiers: [
      { minQuantity: 5, discount: 5 },
      { minQuantity: 10, discount: 10 },
      { minQuantity: 20, discount: 15 },
    ],
  },
  {
    maxPrice: Infinity,
    tiers: [
      { minQuantity: 2, discount: 5 },
      { minQuantity: 5, discount: 10 },
      { minQuantity: 10, discount: 15 },
    ],
  },
];

function calculateWholesalePrice(productPrice, quantity) {
  if (!Number.isFinite(productPrice) || productPrice < 0) {
    throw new Error("Invalid product price.");
  }

  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive whole number.");
  }

  const priceRange = wholesaleTiers.find(
    (range) => productPrice <= range.maxPrice,
  );

  let discount = 0;

  for (const tier of priceRange.tiers) {
    if (quantity >= tier.minQuantity) {
      discount = tier.discount;
    }
  }

  const regularTotal = productPrice * quantity;
  const discountAmount = regularTotal * (discount / 100);
  const finalTotal = regularTotal - discountAmount;

  return {
    productPrice,
    quantity,
    discountPercentage: discount,
    regularTotal: Number(regularTotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
  };
}

module.exports = { calculateWholesalePrice };
