import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";

export const loginUser = async (email, password) => {
  // 🔹 Check ADMIN
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin) {
    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      const token = jwt.sign(
        { id: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return {
        token,
        role: admin.role,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      };
    }
  }

  // 🔹 Check STUDENT
  const student = await prisma.student.findUnique({ where: { email } });

  if (student) {
    const match = await bcrypt.compare(password, student.password);
    if (match) {
      const token = jwt.sign(
        { id: student.id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return {
        token,
        role: "student",
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
        },
      };
    }
  }

  // ❌ Only fail if BOTH fail
  throw new Error("Invalid credentials");
};
