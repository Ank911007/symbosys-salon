const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Clearing database...');
  await prisma.review.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.stylist.deleteMany({});
  await prisma.salon.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@mintasalon.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+91-9876543210',
    },
  });

  console.log('Seeding salon owner user...');
  const ownerPassword = await bcrypt.hash('owner123', 12);
  const owner = await prisma.user.create({
    data: {
      name: 'Salon Owner',
      email: 'owner@mintasalon.com',
      passwordHash: ownerPassword,
      role: 'SALON_OWNER',
      phone: '+91-9876543211',
    },
  });

  console.log('Seeding curated mock salons from frontend into database...');
  
  const mockSalons = [
    {
      name: "Valentino X Family Salon",
      rating: 4.9,
      totalReviews: 258,
      category: "Beauty Parlour",
      address: "Shop no 11, Mohan Marketing Complex, Ashok Nagar",
      features: ["On-site services"],
      lat: 23.3441,
      lng: 85.3096,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000",
      website: "https://www.instagram.com/valentinoxsalon/",
      ownerId: owner.id, // Link first salon to the test owner
      openTime: '09:00',
      closeTime: '21:00',
    },
    {
      name: "Page 3 Luxury Salon & Makeover Studio",
      rating: 4.9,
      totalReviews: 143,
      category: "Beauty Parlour",
      address: "H37, Harmu Rd, near Chetak Showroom",
      lat: 23.3500,
      lng: 85.3200,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2000",
      website: "https://locations.page3salon.com/page-3-luxury-salon-makeover-studio-beauty-salons-harmu-housing-colony-ranchi-426102/Home"
    },
    {
      name: "Cheveux Vuitton | Family Salon and SPA",
      rating: 4.8,
      totalReviews: 546,
      category: "Beauty Parlour",
      address: "gopal Marketing complex, Argora",
      features: ["3+ years in business"],
      lat: 23.3600,
      lng: 85.3300,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=2000",
      website: "https://cheveuxvuitton.com"
    },
    {
      name: "F Salon Ranchi by FTV",
      rating: 4.9,
      totalReviews: 130,
      category: "Wellness center",
      address: "NO.2, 2nd Floor Area in Sai Arcade, Ashok Nagar",
      features: ["On-site services"],
      lat: 23.3300,
      lng: 85.3100,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=2000",
      website: "https://fsalonbyftv.in"
    },
    {
      name: "Naturals Salon",
      rating: 4.9,
      totalReviews: 147,
      category: "Beauty Parlour",
      address: "Shop No 1, 1st Floor, Sunita Complex, Harmu Rd",
      lat: 23.3550,
      lng: 85.3150,
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=2000",
      website: "https://www.naturals.in"
    },
    {
      name: "Lotus Salon Ranchi",
      rating: 4.7,
      totalReviews: 208,
      category: "Beauty Parlour",
      address: "Chedi complex, opp. to Bawarchi",
      lat: 23.3400,
      lng: 85.3000,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000",
      website: "https://www.lotusunisexsalon.com"
    },
    {
      name: "Looks Salon – Best Unisex Salon in Ranchi",
      rating: 4.8,
      totalReviews: 633,
      category: "Beauty Parlour",
      address: "1st Floor, RSP HOUSE, Ratu Rd",
      lat: 23.3650,
      lng: 85.3250,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000",
      website: "https://www.lookssalon.in"
    }
  ];

  for (const s of mockSalons) {
    const { address, lat, lng, ...salonData } = s;
    
    await prisma.salon.create({
      data: {
        ...salonData,
        salonAddress: {
          create: { address, lat, lng }
        },
        services: {
          create: [
            { name: "Signature Haircut", duration: 60, price: 85.00 },
            { name: "Deep Tissue Massage", duration: 90, price: 120.00 },
            { name: "Botanical Hair Spa", duration: 45, price: 65.00 },
            { name: "Radiance Facial", duration: 60, price: 95.00 }
          ]
        },
        stylists: {
          create: [
            { name: "Senior Stylist", bio: "Expert in modern cuts and colors." },
            { name: "Master Therapist", bio: "Holistic wellness expert." }
          ]
        }
      }
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
