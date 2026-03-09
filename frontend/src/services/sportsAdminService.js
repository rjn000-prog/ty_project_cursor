import axios from "axios";

const API = "http://localhost:5000/api/sports-admin";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getSportsAdminDashboard = async () => {
  const res = await axios.get(`${API}/dashboard`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getSportsAnalytics = async () => {
  const res = await axios.get(`${API}/analytics`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const listSports = async () => {
  const res = await axios.get(`${API}/sports`, { headers: authHeaders() });
  return res.data;
};

export const createSport = async (payload) => {
  const res = await axios.post(`${API}/sports`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateSport = async (id, payload) => {
  const res = await axios.put(`${API}/sports/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteSport = async (id) => {
  const res = await axios.delete(`${API}/sports/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const listTeams = async (params = {}) => {
  const res = await axios.get(`${API}/teams`, {
    headers: authHeaders(),
    params,
  });
  return res.data;
};

export const createTeam = async (payload) => {
  const res = await axios.post(`${API}/teams`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateTeam = async (id, payload) => {
  const res = await axios.put(`${API}/teams/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteTeam = async (id) => {
  const res = await axios.delete(`${API}/teams/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const addPlayerToTeam = async (teamId, payload) => {
  const res = await axios.post(`${API}/teams/${teamId}/players`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const removePlayerFromTeam = async (teamId, studentId) => {
  const res = await axios.delete(
    `${API}/teams/${teamId}/players/${studentId}`,
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};

export const listTournaments = async (params = {}) => {
  const res = await axios.get(`${API}/tournaments`, {
    headers: authHeaders(),
    params,
  });
  return res.data;
};

export const createTournament = async (payload) => {
  const res = await axios.post(`${API}/tournaments`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateTournament = async (id, payload) => {
  const res = await axios.put(`${API}/tournaments/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteTournament = async (id) => {
  const res = await axios.delete(`${API}/tournaments/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const listMatches = async (params = {}) => {
  const res = await axios.get(`${API}/matches`, {
    headers: authHeaders(),
    params,
  });
  return res.data;
};

export const createMatch = async (payload) => {
  const res = await axios.post(`${API}/matches`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateMatch = async (id, payload) => {
  const res = await axios.put(`${API}/matches/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteMatch = async (id) => {
  const res = await axios.delete(`${API}/matches/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const listSportsRegistrations = async (params = {}) => {
  const res = await axios.get(`${API}/registrations`, {
    headers: authHeaders(),
    params,
  });
  return res.data;
};

export const updateSportsRegistrationStatus = async (id, status) => {
  const res = await axios.patch(
    `${API}/registrations/${id}`,
    { status },
    { headers: authHeaders() }
  );
  return res.data;
};

