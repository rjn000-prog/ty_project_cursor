import axios from "axios";

const API = "http://localhost:5000/api/admin";

export const getAdminDashboard = async () => {
  const res = await axios.get(`${API}/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};

export const createClubAdmin = async ({ name, email, password }) => {
  const res = await axios.post(
    `${API}/club-admins`,
    { name, email, password },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
};

export const createSportsAdmin = async ({ name, email, password }) => {
  const res = await axios.post(
    `${API}/sports-admins`,
    { name, email, password },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
};

export const createClubWithAdmin = async (payload) => {
  const res = await axios.post(`${API}/clubs`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// SUPER ADMIN: Clubs Management
export const getAllClubsForAdmin = async () => {
  const res = await axios.get(`${API}/clubs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const updateClubForAdmin = async (id, payload) => {
  const res = await axios.put(`${API}/clubs/${id}`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const deleteClubForAdmin = async (id) => {
  const res = await axios.delete(`${API}/clubs/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// SUPER ADMIN: Events Management
export const getAllEventsForAdmin = async () => {
  const res = await axios.get(`${API}/events`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const updateEventForAdmin = async (id, payload) => {
  const res = await axios.put(`${API}/events/${id}`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const deleteEventForAdmin = async (id) => {
  const res = await axios.delete(`${API}/events/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};
