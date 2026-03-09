import prisma from "../../config/db.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        department: true,
        registrations: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      student: {
        name: student.name,
        email: student.email,
        year: student.year,
        department: student.department.name,
      },
      registrations: student.registrations.map((r) => ({
        eventName: r.event.name,
        eventDate: r.event.date,
        status: r.status,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
