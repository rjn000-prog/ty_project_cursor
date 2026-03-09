import axios from "axios";

const API = "http://localhost:5000/api/gallery";

export const getGallery = async (params = {}) => {
  const res = await axios.get(API, { params });
  return res.data;
};

