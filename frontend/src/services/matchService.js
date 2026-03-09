const API = "http://localhost:5000/api/public/matches";

export const getAllMatches = async () => {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Failed to fetch matches");
        return res.json();
    } catch (error) {
        console.error("Fetch matches error:", error);
        return [];
    }
};
