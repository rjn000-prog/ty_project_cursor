import prisma from "../config/db.js";

export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { id: "asc" }
    });

    res.json(clubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch clubs" });
  }
};

export const getClubById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const club = await prisma.club.findUnique({
      where: { id }
    });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.json(club);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch club" });
  }
};

