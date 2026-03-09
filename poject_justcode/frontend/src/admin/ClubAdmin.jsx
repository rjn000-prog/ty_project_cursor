import { useEffect, useState } from "react";
import './ClubAdmin.css';
function ClubAdmin() {

  // 🔐 ADMIN PROTECTION — THIS IS WHERE IT GOES
  useEffect(() => {
    fetch("http://localhost:5000/admin/check", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
        }
      })
      .catch(() => {
        window.location.href = "/admin/login";
      });
  }, []);

  // 📝 FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    presidentName: "",
    contactEmail: "",
    capacity: "",
    location: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/admin/clubs", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="admin-form">
      <h2>Add Club</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Club Name" onChange={handleChange} />
        <input name="type" placeholder="Type" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <input name="presidentName" placeholder="President Name" onChange={handleChange} />
        <input name="contactEmail" placeholder="Contact Email" onChange={handleChange} />
        <input name="capacity" type="number" placeholder="Capacity" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />

        <button type="submit">Add Club</button>
      </form>
    </div>
  );
}

export default ClubAdmin;
