import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

async function main() {
  const email = "superadmin@pccas.edu";
  const password = "superadmin123";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Super admin already exists:", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      name: "Super Admin",
      email,
      password: hashed,
      role: "super_admin",
    },
  });

  console.log("✅ Super admin created:");
  console.log("  email   :", admin.email);
  console.log("  password: superadmin123");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

