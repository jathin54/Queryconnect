import React, { useState, useEffect } from "react";
import DashboardHeader from "../DashboardHeader";
import DashboardTutorHeader from "../DashboardTutorHeader";
import { useNavigate } from "react-router-dom";

const MyConnections = () => {
  const [connections, setConnections] = useState([]);
  const token = localStorage.getItem("student");
  const navigate = useNavigate();
  useEffect(() => {
    fetchMyConnections();
  }, []); // Empty dependency array to mimic componentDidMount

  const fetchMyConnections = async () => {
    try {
      const token1 = localStorage.getItem("student");
      const token = localStorage.getItem("token");
      const apiUrl = token1
        ? "http://localhost:3000/students/connected-tutors"
        : "http://localhost:3000/tutors/connected-students";

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (token1) setConnections(data.connectedTutors);
        else setConnections(data.connectedStudents);
      } else {
        console.error("Error fetching notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const moveTo = (id) => {
    localStorage.setItem("tutorId", id);
    navigate("/tutor-details");
  };
  return (
    <>
      {token ? <DashboardHeader /> : <DashboardTutorHeader />}
      <div className="notification-body">
        <ul className="list-of-notification">
          {connections.map((each) => (
            <li className="each-notification" key={each.username} onClick={() => moveTo(each._id)}>
              <img src = {each.profilePic} alt = "profile" className="chat-box-profile"/>
              <h3>{each.username}</h3>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MyConnections;
