import express from "express";
import { getAllClubs, getClubById } from "../controllers/club.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import prisma from "../config/db.js";
import { validateFormData } from "../utils/formSchema.js";
import { sendEmail } from "../utils/mailer.js";

const router = express.Router();

router.get("/", getAllClubs);
router.get("/:id", getClubById);

/* ✅ JOIN CLUB ROUTE */
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const studentId = Number(req.user.id);
    const clubId = Number(req.params.id);

    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) return res.status(404).json({ message: "Club not found" });

    const existing = await prisma.clubmember.findFirst({
      where: { studentId, clubId }
    });

    if (existing) {
      return res.status(400).json({ message: "Already joined this club" });
    }

    const formData = req.body?.formData || {};
    const validation = validateFormData(club.joinFormSchema, formData);
    if (!validation.ok) {
      return res.status(400).json({
        message: "Invalid join form",
        errors: validation.errors,
      });
    }

    await prisma.clubmember.create({
      data: {
        studentId,
        clubId,
        extraData: JSON.stringify(formData)
        // ✅ role auto = "member"
      }
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { email: true, name: true },
    });

    if (student?.email) {
      await sendEmail({
        to: student.email,
        subject: `Club joined: ${club.name}`,
        html: `<p>Hi ${student.name || "Student"},</p><p>You have successfully joined <b>${club.name}</b>.</p><p>Location: ${club.location}</p>`,
      });
    }

    res.json({ message: "Joined successfully 🎉" });

  } catch (err) {
    console.error("JOIN CLUB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;