const API = "http://localhost:5000/api/events";

export const getAllEvents = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export const getEventById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
};
