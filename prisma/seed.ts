import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@foodtruck.local";
  const password = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, name: "Demo User" }
  });
  console.log("Seeded demo user:", email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
