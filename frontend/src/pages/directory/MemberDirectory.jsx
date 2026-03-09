import React, { useState, useEffect } from "react";
import axios from "axios";
import "./member-directory.css";

const API = "http://localhost:5000/api/directory";

const MemberDirectory = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");

    useEffect(() => {
        const fetchDirectory = async () => {
            try {
                const res = await axios.get(API, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setMembers(res.data);
            } catch (err) {
                console.error("Failed to fetch directory", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDirectory();
    }, []);

    const departments = ["All", ...new Set(members.map(m => m.department))];

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === "All" || m.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    if (loading) return <div className="directory-loading">Loading Members...</div>;

    return (
        <div className="directory-page">
            <div className="directory-header">
                <h1 className="directory-title">Member Directory</h1>
                <p className="directory-subtitle">Connect with seniors, juniors, and teammates across the college.</p>
            </div>

            <div className="directory-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div className="directory-grid">
                {filteredMembers.map(member => (
                    <div key={member.id} className="member-card animate-fade-up">
                        <div className="member-avatar">
                            {member.name.charAt(0)}
                        </div>
                        <div className="member-info">
                            <h3 className="member-name">{member.name}</h3>
                            <p className="member-dept">{member.department} • Year {member.year}</p>
                            <div className="member-sports">
                                {member.sports.length > 0 ? (
                                    member.sports.map(s => <span key={s} className="sport-tag">{s}</span>)
                                ) : (
                                    <span className="no-sports">No sports registered</span>
                                )}
                            </div>
                        </div>
                        <div className="member-actions">
                            <a href={`mailto:${member.email}`} className="connect-btn">Connect</a>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="no-results">No members found matching your criteria.</div>
            )}
        </div>
    );
};

export default MemberDirectory;
