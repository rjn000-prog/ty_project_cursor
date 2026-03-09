const API = "http://localhost:5000/api/clubs";

// Get all clubs
export const getAllClubs = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Failed to fetch clubs");
  }

  return res.json();
};

// Get single club by id
export const getClubById = async (id) => {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Club not found");
  }

  return res.json();
};
