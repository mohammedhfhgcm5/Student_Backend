import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminNationalNumber = '0000000000';
const adminEmail = process.env.ADMIN_EMAIL!;

  // check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    await prisma.user.create({
      data: {
        fullName: 'System Administrator',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        nationalNumber: adminNationalNumber,
      },
    });

    console.log('✅ Admin user created successfully!');
  } else {
    console.log('ℹ️ Admin already exists. Skipping seed.');
  }
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
