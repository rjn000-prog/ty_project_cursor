import axios from "axios";

const API_URL = "http://localhost:5000/api/student";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getStudentDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: authHeaders(),
  });

  return response.data;
};

export const registerForSport = async (sportId) => {
  const res = await axios.post(
    `${API_URL}/sports/${sportId}/register`,
    {},
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};
