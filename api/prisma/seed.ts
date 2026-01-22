import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import { PrismaClient } from '../src/prisma/generated/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME;

  if (!email || !plainPassword || !name) {
    console.log('Admin seed ignorado (env não definida).');
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Usuário padrão já existe, seed ignorado.');
    return;
  }

  const hashedPassword = await argon2.hash(plainPassword);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  console.log('Usuário padrão criado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
