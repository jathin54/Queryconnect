// Modify the React component
import { Component } from "react";
import DashboardHeader from "../DashboardHeader";
import { RiNotificationBadgeFill } from "react-icons/ri";

import "./index.css";
import DashboardTutorHeader from "../DashboardTutorHeader";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  componentDidMount() {
    this.fetchNotifications();
  }

  fetchNotifications = async () => {
    try {
      const token1 = localStorage.getItem("student");
      const token = localStorage.getItem("token")
      const apiUrl = token1
        ? "http://localhost:3000/students/notifications"
        : "http://localhost:3000/tutors/notifications";

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        this.setState({ notifications: data.notifications });
      } else {
        console.error("Error fetching notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  handleAcceptRequest = async (notificationId) => {

    try {
      const response = await fetch(`http://localhost:3000/accept-connection-request/${notificationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode:"cors"
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        this.fetchNotifications()
      } else {
        console.error('Failed to accept connection request:', data.error);
        // Handle error appropriately
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error appropriately
    }
  };

  render() {
    const token = localStorage.getItem("student");
    //const list = token ? "/dashboard-student" : "/dashboard-tutor";

    return (
      <div>
       {token ? <DashboardHeader/> : <DashboardTutorHeader/>}
        <div className="notification-body">
          <ul className="list-of-notification">
            {this.state.notifications.map((notification, index) => (
              <li key={index} className="each-notification">
                <RiNotificationBadgeFill className="notification-icon" />
                <div style={{marginRight:"50%"}}>
                  <h3>{notification.message}</h3>
                  <p>{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
                {notification.message.includes("Connection request from") && (
                  <button onClick={() => this.handleAcceptRequest(notification.notificationId)} style={{alignSelf:"center"}}>
                    Accept
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Notifications;
