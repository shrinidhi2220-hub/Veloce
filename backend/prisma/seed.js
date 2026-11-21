const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.inventoryEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.resaleListing.deleteMany();
  await prisma.surpriseRequest.deleteMany();
  await prisma.sharingConsent.deleteMany();
  await prisma.rewardLedger.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      phone: '+91-9876543210',
      city: 'Bengaluru',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      phone: '+91-9876543211',
      city: 'Mumbai',
    },
  });

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple iPhone with A17 Pro chip',
        category: 'Electronics',
        brand: 'Apple',
        city: 'Bengaluru',
        price: 129900,
        wholesalePrice: 124900,
        wholesaleQty: 5,
        stock: 50,
        images: ['https://via.placeholder.com/300x300?text=iPhone+15+Pro'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24',
        description: 'Flagship Samsung smartphone with AI features',
        category: 'Electronics',
        brand: 'Samsung',
        city: 'Mumbai',
        price: 79999,
        wholesalePrice: 74999,
        wholesaleQty: 10,
        stock: 100,
        images: ['https://via.placeholder.com/300x300?text=Galaxy+S24'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Premium noise-cancelling wireless headphones',
        category: 'Electronics',
        brand: 'Sony',
        city: 'Delhi',
        price: 29990,
        wholesalePrice: 26990,
        wholesaleQty: 8,
        stock: 75,
        images: ['https://via.placeholder.com/300x300?text=Sony+Headphones'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Air Max cushioning',
        category: 'Fashion',
        brand: 'Nike',
        city: 'Bengaluru',
        price: 12995,
        wholesalePrice: 10995,
        wholesaleQty: 12,
        stock: 200,
        images: ['https://via.placeholder.com/300x300?text=Nike+Air+Max'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Levi\'s 501 Original Jeans',
        description: 'Classic straight fit jeans in premium denim',
        category: 'Fashion',
        brand: 'Levi\'s',
        city: 'Mumbai',
        price: 4499,
        wholesalePrice: 3999,
        wholesaleQty: 15,
        stock: 150,
        images: ['https://via.placeholder.com/300x300?text=Levis+Jeans'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Philips Air Fryer HD9252',
        description: 'Healthy cooking with rapid air technology',
        category: 'Home & Kitchen',
        brand: 'Philips',
        city: 'Delhi',
        price: 8999,
        wholesalePrice: 7999,
        wholesaleQty: 6,
        stock: 80,
        images: ['https://via.placeholder.com/300x300?text=Air+Fryer'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Atomic Habits by James Clear',
        description: 'Bestselling book on building good habits',
        category: 'Books',
        brand: 'Penguin',
        city: 'Bengaluru',
        price: 599,
        wholesalePrice: 499,
        wholesaleQty: 20,
        stock: 300,
        images: ['https://via.placeholder.com/300x300?text=Atomic+Habits'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'Limited Edition Watch',
        description: 'Only 1 piece left! Premium quality wristwatch',
        category: 'Fashion',
        brand: 'Fossil',
        city: 'Bengaluru',
        price: 15999,
        stock: 1,
        images: ['https://via.placeholder.com/300x300?text=Limited+Watch'],
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);
  console.log(`✅ Created 2 users`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });