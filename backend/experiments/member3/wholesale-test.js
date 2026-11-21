const { calculateWholesalePrice } = require("./wholesale-pricing");

const testCases = [
  { price: 500, quantity: 10 },
  { price: 500, quantity: 50 },
  { price: 500, quantity: 100 },
  { price: 500, quantity: 200 },
  { price: 3000, quantity: 40 },
  { price: 60000, quantity: 5 },
  { price: 60000, quantity: 10 },
];

for (const test of testCases) {
  const result = calculateWholesalePrice(test.price, test.quantity);

  console.log("\nWholesale calculation:");
  console.log(result);
}

console.log("\n========== INVALID INPUT TESTS ==========");

const invalidCases = [
    { price: 500, quantity: 0 },
    { price: 500, quantity: -5 },
    { price: 500, quantity: 2.5 },
    { price: -100, quantity: 10 },
    { price: NaN, quantity: 10 }
];

for (const test of invalidCases) {
    try {
        calculateWholesalePrice(test.price, test.quantity);
        console.log("FAILED: Invalid input was accepted", test);
    } catch (error) {
        console.log("PASSED:", error.message);
    }
}
