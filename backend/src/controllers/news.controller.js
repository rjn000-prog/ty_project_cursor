import prisma from "../config/db.js";

export const listPublicNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      where: { visible: true },
      orderBy: { publishedAt: "desc" },
      take: 12,
    });
    res.json(news);
  } catch (error) {
    console.error("listPublicNews error:", error);
    res.status(500).json({ message: "Failed to load news" });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const item = await prisma.news.findUnique({ where: { slug } });
    if (!item || !item.visible) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("getNewsBySlug error:", error);
    res.status(500).json({ message: "Failed to load news item" });
  }
};

export const listAdminNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
    });
    res.json(news);
  } catch (error) {
    console.error("listAdminNews error:", error);
    res.status(500).json({ message: "Failed to load news" });
  }
};

export const createAdminNews = async (req, res) => {
  try {
    const { title, slug, summary, content, imageUrl, visible, category } = req.body || {};
    if (!title || !slug || !summary || !content) {
      return res.status(400).json({
        message: "title, slug, summary and content are required",
      });
    }
    const created = await prisma.news.create({
      data: {
        title,
        slug,
        summary,
        content,
        imageUrl: imageUrl || null,
        category: category || "news",
        visible: visible !== undefined ? !!visible : true,
      },
    });
    res.status(201).json({ message: "News created", news: created });
  } catch (error) {
    console.error("createAdminNews error:", error);
    res.status(500).json({ message: "Failed to create news" });
  }
};

export const updateAdminNews = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, summary, content, imageUrl, visible, category } = req.body || {};
    const updated = await prisma.news.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(visible !== undefined && { visible: !!visible }),
      },
    });
    res.json({ message: "News updated", news: updated });
  } catch (error) {
    console.error("updateAdminNews error:", error);
    res.status(500).json({ message: "Failed to update news" });
  }
};

export const deleteAdminNews = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.news.delete({ where: { id } });
    res.json({ message: "News deleted" });
  } catch (error) {
    console.error("deleteAdminNews error:", error);
    res.status(500).json({ message: "Failed to delete news" });
  }
};

