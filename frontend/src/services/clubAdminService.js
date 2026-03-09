import axios from "axios";

const API = "http://localhost:5000/api/club-admin";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getClubAdminDashboard = async () => {
  const res = await axios.get(`${API}/dashboard`, {
    headers: authHeaders(),
  });
  return res.data;
};

// Clubs
export const createClubForAdmin = async (payload) => {
  const res = await axios.post(`${API}/clubs`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getAllClubsForAdmin = async () => {
  const res = await axios.get(`${API}/clubs`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteClubForAdmin = async (id) => {
  const res = await axios.delete(`${API}/clubs/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getClubByIdForAdmin = async (id) => {
  const res = await axios.get(`${API}/clubs/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateClubByIdForAdmin = async (id, payload) => {
  const res = await axios.put(`${API}/clubs/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getClubMembersForAdmin = async (clubId) => {
  const res = await axios.get(`${API}/clubs/${clubId}/members`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const removeClubMemberForAdmin = async (clubId, memberId) => {
  const res = await axios.delete(`${API}/clubs/${clubId}/members/${memberId}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const setClubJoinFormSchema = async (clubId, schema) => {
  const res = await axios.put(
    `${API}/clubs/${clubId}/join-form-schema`,
    { schema },
    { headers: authHeaders() }
  );
  return res.data;
};

// Events
export const getAllEventsForAdmin = async ({ clubId } = {}) => {
  const res = await axios.get(`${API}/events`, {
    headers: authHeaders(),
    params: clubId ? { clubId } : undefined,
  });
  return res.data;
};

export const getEventByIdForAdmin = async (id) => {
  const res = await axios.get(`${API}/events/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteEventForAdmin = async (id) => {
  const res = await axios.delete(`${API}/events/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const createEventForAdmin = async (payload) => {
  const res = await axios.post(`${API}/events`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateEventForAdmin = async (id, payload) => {
  const res = await axios.put(`${API}/events/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getEventRegistrationsForAdmin = async (eventId) => {
  const res = await axios.get(`${API}/events/${eventId}/registrations`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getEventFeedbackForAdmin = async (eventId) => {
  const res = await axios.get(`${API}/events/${eventId}/feedback`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateEventRegistrationStatus = async (regId, status) => {
  const res = await axios.put(
    `${API}/registrations/${regId}/update-status`,
    { status },
    { headers: authHeaders() }
  );
  return res.data;
};

export const setEventRegistrationFormSchema = async (eventId, schema) => {
  const res = await axios.put(
    `${API}/events/${eventId}/registration-form-schema`,
    { schema },
    { headers: authHeaders() }
  );
  return res.data;
};

// Analytics
export const getClubAdminAnalytics = async () => {
  const res = await axios.get(`${API}/analytics`, {
    headers: authHeaders(),
  });
  return res.data;
};

// Pro Features
export const issueCertificatesForEvent = async (eventId) => {
  const res = await axios.post(`${API}/events/${eventId}/issue-certificates`, {}, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getRegistrationTicket = async (regId) => {
  const res = await axios.get(`${API}/registrations/${regId}/ticket`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const verifyAttendanceByQR = async (token) => {
  const res = await axios.post(`${API}/attendance/verify`, { token }, {
    headers: authHeaders(),
  });
  return res.data;
};

export const broadcastToEventParticipants = async (eventId, payload) => {
  const res = await axios.post(`${API}/events/${eventId}/broadcast`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};
