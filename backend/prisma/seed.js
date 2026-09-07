/**
 * Seed de datos iniciales para Robledo Atelier CRM.
 * Ejecutar con: npm run prisma:seed
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de Robledo Atelier CRM...");

  // --- Usuarios ---
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@robledoatelier.com" },
    update: {},
    create: {
      name: "Valeria Robledo",
      email: "admin@robledoatelier.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const designer = await prisma.user.upsert({
    where: { email: "diseno@robledoatelier.com" },
    update: {},
    create: {
      name: "Mateo Sotomayor",
      email: "diseno@robledoatelier.com",
      passwordHash,
      role: "DESIGNER",
    },
  });

  // --- Categorías de Atelier ---
  const categoriesData = [
    { name: "Salones & Sofás", collection: "Lombardía & Riviera", description: "Asientos envolventes, lino belga y terciopelo de seda" },
    { name: "Comedores & Mesas", collection: "Nordic Monolith", description: "Maderas macizas de roble, nogal y sobres de mármol Carrara" },
    { name: "Dormitorios Principales", collection: "Suites Privadas", description: "Cabeceros tapizados a medida y estructuras de madera estufada" },
    { name: "Estudios & Bibliotecas", collection: "Atelier Executive", description: "Escritorios en nogal ahumado con pasacables en latón" },
    { name: "Terrazas & Exteriores", collection: "Mediterráneo", description: "Teca tratada para intemperie, cuerda náutica y cojinería hidrófuga" },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.name] = await prisma.category.upsert({
      where: { name: cat.name },
      update: { collection: cat.collection, description: cat.description },
      create: cat,
    });
  }

  // --- Productos / Piezas de Catálogo ---
  const productsData = [
    {
      sku: "SAL-001",
      name: "Sofá Milano 3 Puestos Curvo",
      collection: "Lombardía 2026",
      description: "Silueta orgánica con estructura en roble macizo y espuma de alta resiliencia.",
      materials: "Lino Crudo Belga & Madera de Roble",
      dimensions: "245 x 100 x 82 cm",
      categoryId: categories["Salones & Sofás"].id,
      price: 4850000,
      cost: 2600000,
      stock: 6,
      minStock: 2,
      inShowroom: true,
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    },
    {
      sku: "SAL-002",
      name: "Poltrona Bergère Florence",
      collection: "Riviera Heritage",
      description: "Pieza de acento tapizada a mano con remates en latón cepillado.",
      materials: "Bouclé Crema & Patas en Nogal",
      dimensions: "88 x 92 x 78 cm",
      categoryId: categories["Salones & Sofás"].id,
      price: 2450000,
      cost: 1300000,
      stock: 2,
      minStock: 3,
      inShowroom: true,
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    },
    {
      sku: "COM-001",
      name: "Mesa Comedor Monolith 8P",
      collection: "Nordic Monolith",
      description: "Tablero macizo de 45mm con bordes vivos naturales y base geométrica.",
      materials: "Nogal Macizo Americano con Acabado Cera Mate",
      dimensions: "280 x 110 x 76 cm",
      categoryId: categories["Comedores & Mesas"].id,
      price: 6800000,
      cost: 3900000,
      stock: 4,
      minStock: 2,
      inShowroom: true,
      imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80",
    },
    {
      sku: "COM-002",
      name: "Silla de Comedor Oslo (Set x2)",
      collection: "Nordic Monolith",
      description: "Ergonomía artesanal con respaldo curvado al vapor y tapicería en cuero anilina.",
      materials: "Roble Ahumado & Cuero Siena",
      dimensions: "52 x 56 x 80 cm",
      categoryId: categories["Comedores & Mesas"].id,
      price: 1650000,
      cost: 850000,
      stock: 1,
      minStock: 4,
      inShowroom: true,
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop&q=80",
    },
    {
      sku: "DOR-001",
      name: "Cama King Size Verona Flotante",
      collection: "Suites Privadas",
      description: "Plataforma suspendida con mesitas de noche integradas e iluminación cálida oculta.",
      materials: "Roble Tostado & Cabecero Acolchado en Chenille",
      dimensions: "220 x 230 x 115 cm",
      categoryId: categories["Dormitorios Principales"].id,
      price: 5900000,
      cost: 3200000,
      stock: 3,
      minStock: 2,
      inShowroom: false,
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80",
    },
    {
      sku: "OFI-001",
      name: "Escritorio Magistral Praga",
      collection: "Atelier Executive",
      description: "Cajonera con correderas ocultas soft-close y superficie tapizada en cuero genuino.",
      materials: "Nogal & Herrajes de Latón Bruñido",
      dimensions: "180 x 85 x 75 cm",
      categoryId: categories["Estudios & Bibliotecas"].id,
      price: 3750000,
      cost: 1950000,
      stock: 5,
      minStock: 2,
      inShowroom: true,
      imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: p,
      create: p,
    });
  }

  // --- Clientes VIP y Estudios de Arquitectura ---
  const customersData = [
    {
      name: "Carolina Santamaría",
      phone: "+57 300 456 7890",
      email: "carolina.santamaria@estudiovanguardia.com",
      address: "Calle 85 #11-53, PH 901",
      city: "Bogotá",
      documentId: "52.489.123",
      isVip: true,
      clientType: "ESTUDIO_ARQUITECTURA",
      notes: "Directora en Estudio Vanguardia. Prefiere maderas de nogal y acabados en lino crudo.",
    },
    {
      name: "Alejandro Echeverri",
      phone: "+57 312 890 1234",
      email: "alejandro.echeverri@interiores.co",
      address: "Carrera 43A #1-50, Apto 1402",
      city: "Medellín",
      documentId: "98.765.432",
      isVip: true,
      clientType: "PARTICULAR",
      notes: "Amueblando casa campestre en Llanogrande. Cliente recurrente de salas y comedores.",
    },
    {
      name: "Mariana Restrepo",
      phone: "+57 315 234 5678",
      email: "mariana.restrepo@arquitectura.com",
      address: "Av. Circunvalar #12-40",
      city: "Pereira",
      documentId: "42.112.980",
      isVip: false,
      clientType: "PARTICULAR",
      notes: "Interesada en línea de alcobas y vestidores a medida.",
    },
  ];

  for (const c of customersData) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: c,
      create: c,
    });
  }

  // --- Leads de Pipeline Comercial ---
  const leadsData = [
    {
      name: "Felipe Morales (Arq. Studio)",
      company: "Morales & Co Arquitectos",
      email: "felipe@moralesarq.com",
      phone: "+57 310 555 0192",
      source: "ARQUITECTO_DISENADOR",
      status: "CITA_SHOWROOM",
      estimatedBudget: 18500000,
      interestSummary: "Mobiliario completo para Penthouse en El Poblado (Sala, Comedor 10P y Terraza)",
      assignedToId: designer.id,
    },
    {
      name: "Valentina Durán",
      company: "Boutique Hotel Casa Colonial",
      email: "gerencia@casacolonialhotel.com",
      phone: "+57 318 444 8821",
      source: "INSTAGRAM",
      status: "COTIZACION_ENVIADA",
      estimatedBudget: 34000000,
      interestSummary: "12 Poltronas Florence y 6 Mesas de Centro Monolith para lobby principal",
      assignedToId: admin.id,
    },
    {
      name: "Rodrigo Casas",
      company: null,
      email: "rodrigo.casas@gmail.com",
      phone: "+57 301 999 3322",
      source: "SHOWROOM_DIRECTO",
      status: "NEGOCIACION",
      estimatedBudget: 9500000,
      interestSummary: "Sofá Milano Curvo en Lino Italiano + Juego de mesas nido",
      assignedToId: designer.id,
    },
  ];

  for (const l of leadsData) {
    await prisma.lead.create({
      data: l,
    });
  }

  console.log("Seed completado con éxito para Robledo Atelier CRM.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });