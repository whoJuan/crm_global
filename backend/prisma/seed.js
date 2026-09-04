/**
 * Seed de datos iniciales.
 * Ejecutar con: npm run prisma:seed
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // --- Usuario administrador por defecto ---
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@mueblescrm.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@mueblescrm.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  // --- Categorías ---
  const categoriesData = ["Salas", "Comedores", "Dormitorios", "Oficina", "Exteriores"];
  const categories = {};
  for (const name of categoriesData) {
    categories[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // --- Productos ---
  const products = [
    { sku: "SAL-001", name: "Sofá Milano 3 puestos", categoryId: categories["Salas"].id, price: 1890000, cost: 1100000, stock: 12, minStock: 4 },
    { sku: "SAL-002", name: "Sofá seccional Roma", categoryId: categories["Salas"].id, price: 2450000, cost: 1500000, stock: 3, minStock: 4 },
    { sku: "COM-001", name: "Mesa de comedor Nordic 6 puestos", categoryId: categories["Comedores"].id, price: 1590000, cost: 950000, stock: 8, minStock: 3 },
    { sku: "COM-002", name: "Juego de sillas Oslo (x4)", categoryId: categories["Comedores"].id, price: 780000, cost: 420000, stock: 2, minStock: 5 },
    { sku: "DOR-001", name: "Cama Kingsize Verona", categoryId: categories["Dormitorios"].id, price: 2100000, cost: 1300000, stock: 6, minStock: 3 },
    { sku: "OFI-001", name: "Escritorio ejecutivo Praga", categoryId: categories["Oficina"].id, price: 980000, cost: 560000, stock: 15, minStock: 5 },
    { sku: "EXT-001", name: "Set de jardín ratán Bali", categoryId: categories["Exteriores"].id, price: 1350000, cost: 800000, stock: 1, minStock: 3 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  // --- Clientes ---
  const customers = [
    { name: "Laura Gómez", phone: "3001234567", email: "laura.gomez@example.com", address: "Cra 10 #20-30", city: "Pereira" },
    { name: "Carlos Restrepo", phone: "3109876543", email: "carlos.restrepo@example.com", address: "Av. Siempre Viva 742", city: "Manizales" },
    { name: "Muebles y Diseños S.A.S", phone: "3204567890", email: "compras@mueblesydisenos.com", address: "Zona Industrial Km 3", city: "Dosquebradas" },
  ];

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
  }

  console.log("Seed completado.");
  console.log(`Usuario admin: ${admin.email} / contraseña: Admin123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });