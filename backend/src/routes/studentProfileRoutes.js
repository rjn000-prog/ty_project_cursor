import express from "express";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateQRCode, generateTicketToken } from "../services/qrService.js";

const router = express.Router();

/* ================= GET STUDENT PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const studentId = Number(req.user.id);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        rollNo: true,
        name: true,
        email: true,
        dob: true,
        address: true,
        mobile: true,
        year: true,
        department: true
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET STUDENT TICKET ================= */
router.get("/my-ticket/:regId", authMiddleware, async (req, res) => {
  try {
    const studentId = Number(req.user.id);
    const regId = Number(req.params.regId);

    let reg = await prisma.registration.findUnique({
      where: { id: regId },
      include: { event: true, student: true }
    });

    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (reg.studentId !== studentId) return res.status(403).json({ message: "Access denied" });
    if (reg.status !== "APPROVED") {
      return res.status(400).json({ message: "Tickets are only available for approved registrations" });
    }

    if (!reg.ticketToken) {
      const token = generateTicketToken();
      reg = await prisma.registration.update({
        where: { id: regId },
        data: { ticketToken: token },
        include: { event: true, student: true }
      });
    }

    const qrDataUrl = await generateQRCode({
      regId: reg.id,
      token: reg.ticketToken,
      student: reg.student.name,
      event: reg.event.name
    });

    return res.json({
      ticketToken: reg.ticketToken,
      qrCode: qrDataUrl,
      event: reg.event.name,
      student: reg.student.name
    });
  } catch (err) {
    console.error("TICKET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
