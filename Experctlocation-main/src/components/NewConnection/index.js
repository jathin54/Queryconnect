import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import "./index.css";

const NewConnection = () => {
  const [newTutors, setNewTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch new tutors when the component mounts
    fetchNewTutors();
  }, []);

  const fetchNewTutors = async () => {
    try {
      const token = localStorage.getItem("student");
      const response = await fetch("http://localhost:3000/students/new-tutors", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch new tutors");
      }

      const data = await response.json();
      setNewTutors(data.newTutors);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching new tutors:", error);
      setNewTutors([]);
      setLoading(false);
      setError("Failed to fetch new tutors");
    }
  };

  const sendConnectionRequest = async (tutorId) => {
    try {
      const token = localStorage.getItem("student");
     
      const response = await fetch(
        `http://localhost:3000/students/send-connection-request/${tutorId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      );

      const data = await response.json();
      console.log(data);
      if (!data) {
        throw new Error("Failed to send connection request");
      }

      const updatedTutors = newTutors.map((tutor) =>
        tutor._id === tutorId ? { ...tutor, connectionStatus: "sent" } : tutor
      );

      setNewTutors(updatedTutors);
      setLoading(false);
      setError(null);
      fetchNewTutors();

      console.log("Connection request sent successfully");
      alert("Connection request sent successfully");
    } catch (error) {
      console.error("Error sending connection request:", error);
      setLoading(false);
      setError("Failed to send connection request");
    }
  };

  const moveTo = (id) => {
    localStorage.setItem("tutorId", id);
    navigate("/tutor-details");
  };

  return (
    <div className="new-connections-container">
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <CiSearch className="search-icon" />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && newTutors.length === 0 && (
        <p>No new connections available</p>
      )}
      {!loading && !error && newTutors.length > 0 && (
        <ul className="list-of-new-connections">
          {newTutors.map((tutor) => (
            <li
              key={tutor._id}
              className="each-new-connection"
              onClick={() => moveTo(tutor._id)}
            >
              <img
                src= {tutor.profilePic}
                className="new-connection-profile"
                alt="pro"
              />
              <div className="new-connection-details-container">
                <h1 className="new-connection-name">{tutor.username}</h1>
                <p className="new-connection-role">
                  {tutor.domain ? `${tutor.domain}` : "NA"}
                </p>
              </div>
              <button
                className={`new-connection-connection-button ${
                  tutor.connectionStatus === "sent" ? "sent" : ""
                }`}
                onClick={() => sendConnectionRequest(tutor._id)}
                disabled={tutor.connectionStatus === "sent"}
              >
                {tutor.connectionStatus === "sent" ? "Sent" : "Connect"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewConnection;
