import axios from "axios";

const API = "http://localhost:5000/api/student";

export const getProfile = async () => {
  const res = await axios.get(`${API}/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axios.put(`${API}/profile`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.data;
};
