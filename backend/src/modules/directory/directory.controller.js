import prisma from "../../config/db.js";

export const getDirectory = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                showInDirectory: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                year: true,
                department: {
                    select: { name: true }
                },
                sportsregistration: {
                    select: {
                        sport: { select: { name: true } }
                    }
                }
            },
            orderBy: { name: "asc" }
        });

        const formattedDirectory = students.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            year: s.year,
            department: s.department.name,
            sports: s.sportsregistration.map(sr => sr.sport.name)
        }));

        res.json(formattedDirectory);
    } catch (error) {
        console.error("getDirectory error:", error);
        res.status(500).json({ message: "Failed to load member directory" });
    }
};

export const updatePrivacySettings = async (req, res) => {
    try {
        const studentId = Number(req.user.id);
        const { showInDirectory } = req.body;

        await prisma.student.update({
            where: { id: studentId },
            data: { showInDirectory: Boolean(showInDirectory) }
        });

        res.json({ message: "Privacy settings updated successfully" });
    } catch (error) {
        console.error("updatePrivacySettings error:", error);
        res.status(500).json({ message: "Failed to update privacy settings" });
    }
};
