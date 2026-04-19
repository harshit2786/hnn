import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "adarshidy@gmail.com";
const NAME = "Adarshi";
const PASSWORD = "Ink&Parchment#2024";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });

  if (existing) {
    console.log(`User ${EMAIL} already exists — skipping.`);
    return;
  }

  const hashed = await bcrypt.hash(PASSWORD, 12);
  const user = await prisma.user.create({
    data: { email: EMAIL, name: NAME, password: hashed },
  });

  console.log(`✓ Admin user created`);
  console.log(`  Email    : ${user.email}`);
  console.log(`  Password : ${PASSWORD}`);
  console.log(`  ID       : ${user.id}`);
  console.log(`\nSave the password now — it won't be shown again.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
