export async function getStudentDashboard() {
  const res = await fetch("http://localhost:5000/student/dashboard", {
    credentials: "include" // REQUIRED for session
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}
