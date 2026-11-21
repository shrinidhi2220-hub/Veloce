const { calculateWholesalePrice } = require("./wholesale-pricing");

console.log("\n========== WHOLESALE BOUNDARY TESTS ==========\n");

const testCases = [
  // ₹999 price boundary
  { price: 999, quantity: 49, expected: 0 },
  { price: 999, quantity: 50, expected: 5 },
  { price: 999, quantity: 100, expected: 10 },
  { price: 999, quantity: 200, expected: 15 },

  // ₹1000 price boundary
  { price: 1000, quantity: 19, expected: 0 },
  { price: 1000, quantity: 20, expected: 5 },
  { price: 1000, quantity: 40, expected: 10 },
  { price: 1000, quantity: 80, expected: 15 },

  // ₹5000 price boundary
  { price: 5000, quantity: 9, expected: 0 },
  { price: 5000, quantity: 10, expected: 5 },
  { price: 5000, quantity: 20, expected: 10 },
  { price: 5000, quantity: 40, expected: 15 },

  // ₹20000 price boundary
  { price: 20000, quantity: 4, expected: 0 },
  { price: 20000, quantity: 5, expected: 5 },
  { price: 20000, quantity: 10, expected: 10 },
  { price: 20000, quantity: 20, expected: 15 },

  // ₹50000 price boundary
  { price: 50000, quantity: 1, expected: 0 },
  { price: 50000, quantity: 2, expected: 5 },
  { price: 50000, quantity: 5, expected: 10 },
  { price: 50000, quantity: 10, expected: 15 },
];

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = calculateWholesalePrice(test.price, test.quantity);

  if (result.discountPercentage === test.expected) {
    passed++;
    console.log(
      `PASSED: Price ₹${test.price}, Quantity ${test.quantity}, Discount ${result.discountPercentage}%`,
    );
  } else {
    failed++;
    console.log(
      `FAILED: Price ₹${test.price}, Quantity ${test.quantity}, Expected ${test.expected}%, Got ${result.discountPercentage}%`,
    );
  }
}

console.log("\n========== RESULTS ==========");
console.log("Total:", testCases.length);
console.log("Passed:", passed);
console.log("Failed:", failed);
