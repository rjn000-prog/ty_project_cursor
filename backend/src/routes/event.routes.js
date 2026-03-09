import express from "express";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getAllEvents, getEventById } from "../controllers/event.controller.js";
import { validateFormData } from "../utils/formSchema.js";
import { sendEmail } from "../utils/mailer.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

// REGISTER FOR EVENT
router.post("/:id/register", authMiddleware, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const studentId = req.user.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registration: true, club: true }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = event.registration.find(
      reg => reg.studentId === studentId
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    if (event.registration.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    const note = req.body?.note?.trim() || null;
    const formData = req.body?.formData || {};
    const validation = validateFormData(event.registrationFormSchema, formData);
    if (!validation.ok) {
      return res.status(400).json({
        message: "Invalid registration form",
        errors: validation.errors,
      });
    }

    await prisma.registration.create({
      data: {
        studentId,
        eventId,
        status: "registered",
        ...(note && { note }),
        extraData: JSON.stringify(formData),
      }
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { email: true, name: true },
    });

    if (student?.email) {
      await sendEmail({
        to: student.email,
        subject: `Registration Received: ${event.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #6366f1;">Registration Received! 📥</h2>
            <p>Hi <b>${student.name || "Student"}</b>,</p>
            <p>Thank you for registering for <b>${event.name}</b>. Your registration has been received and is currently <b>pending approval</b> by the club admin.</p>
            <p>Once approved, you will receive another email with your official **Entry Ticket** and QR code.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p><b>Event Details:</b></p>
            <ul style="list-style: none; padding: 0;">
              <li>📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString()}</li>
              <li>⏰ <b>Time:</b> ${event.startTime || "TBD"} - ${event.endTime || "TBD"}</li>
              <li>📍 <b>Club:</b> ${event.club?.name || "N/A"}</li>
            </ul>
            <p style="color: #666; font-size: 0.8rem; margin-top: 30px;">This is an automated message from Event Certificate mail.</p>
          </div>
        `,
      });
    }

    res.json({ message: "Successfully registered" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;