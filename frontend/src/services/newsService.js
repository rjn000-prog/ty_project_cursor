import axios from "axios";

const API = "http://localhost:5000/api/news";

export const getNews = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getNewsBySlug = async (slug) => {
  const res = await axios.get(`${API}/${slug}`);
  return res.data;
};

