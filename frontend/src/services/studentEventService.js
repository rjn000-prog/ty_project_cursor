import axios from "axios";

const API = "http://localhost:5000/api/student";

export const getMyEvents = async () => {
  const res = await axios.get(`${API}/my-events`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = res.data;
  return Array.isArray(data) ? data : (data?.events || []);
};

export const submitFeedback = async (eventId, feedback) => {
  const res = await axios.post(
    `${API}/feedback/${eventId}`,
    feedback,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return res.data;
};

export const getMyTicket = async (regId) => {
  const res = await axios.get(`${API}/my-ticket/${regId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.data;
};

export const downloadCertificate = async (regId) => {
  const res = await axios.get(`${API}/certificates/${regId}/download`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    responseType: 'blob'
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `certificate_${regId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
