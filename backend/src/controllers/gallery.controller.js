import prisma from "../config/db.js";

export const listPublicGallery = async (req, res) => {
  try {
    const clubId = req.query.clubId ? Number(req.query.clubId) : null;
    const items = await prisma.galleryitem.findMany({
      where: {
        visible: true,
        ...(clubId ? { clubId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 24,
    });
    res.json(items);
  } catch (error) {
    console.error("listPublicGallery error:", error);
    res.status(500).json({ message: "Failed to load gallery" });
  }
};

export const listAdminGallery = async (req, res) => {
  try {
    const items = await prisma.galleryitem.findMany({
      include: { club: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (error) {
    console.error("listAdminGallery error:", error);
    res.status(500).json({ message: "Failed to load gallery items" });
  }
};

export const createAdminGalleryItem = async (req, res) => {
  try {
    const { title, caption, imageUrl, clubId, visible } = req.body || {};
    if (!title || !imageUrl) {
      return res
        .status(400)
        .json({ message: "title and imageUrl are required" });
    }
    const data = {
      title,
      caption: caption || null,
      imageUrl,
      visible: visible !== undefined ? !!visible : true,
    };
    if (clubId) data.clubId = Number(clubId);
    const created = await prisma.galleryitem.create({ data });
    res.status(201).json({ message: "Gallery item created", item: created });
  } catch (error) {
    console.error("createAdminGalleryItem error:", error);
    res.status(500).json({ message: "Failed to create gallery item" });
  }
};

export const updateAdminGalleryItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, caption, imageUrl, clubId, visible } = req.body || {};
    const updated = await prisma.galleryitem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(caption !== undefined && { caption }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(visible !== undefined && { visible: !!visible }),
        ...(clubId !== undefined && {
          clubId: clubId ? Number(clubId) : null,
        }),
      },
    });
    res.json({ message: "Gallery item updated", item: updated });
  } catch (error) {
    console.error("updateAdminGalleryItem error:", error);
    res.status(500).json({ message: "Failed to update gallery item" });
  }
};

export const deleteAdminGalleryItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.galleryitem.delete({ where: { id } });
    res.json({ message: "Gallery item deleted" });
  } catch (error) {
    console.error("deleteAdminGalleryItem error:", error);
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
};

