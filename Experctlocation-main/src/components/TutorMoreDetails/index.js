import { Component } from "react";

import "./index.css"
import Appp from "../Barchart";
class TutorMoreDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
          tutor: null,
        };
      }
    
      componentDidMount() {
        this.fetchTutorProfile();
      }
    
      fetchTutorProfile = async () => {
        try {
          const userId = localStorage.getItem("tutorId");
          console.log(userId);
          const response = await fetch(`http://localhost:3000/tutors/profile?userId=${userId}`, {
            mode: 'cors',
          });
    
          if (!response.ok) {
            throw new Error(`Error fetching tutor profile: ${response.statusText}`);
          }
    
          const data = await response.json();

          this.setState({ tutor: data.profile });
        } catch (error) {
          console.error('Error fetching tutor profile:', error);
        }
      };
    
      render() {
        const { tutor } = this.state;
       
        if (!tutor) {
          return <div>Loading...</div>;
        }
    
        return (
        <>
          <div className="tutor-details-container">
            <div className="profile-pic-container">
              <img src={tutor.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="Tutor Profile" style={{height:"100px",width:"100px",borderRadius:"50%"}} />
            </div>
            <div className="details-container">
              <h1 className="username">{tutor.username}</h1>
              <p className="about">{tutor.about}</p>
              <div className="contact-details">
                <p>Contact: {tutor.contact}</p>
                <p>Email: {tutor.email}</p>
                <p>Address: {tutor.address}</p>
              </div>
              <div className="additional-details">
                <p>Domain: {tutor.domain}</p>
                <p>Experience: {tutor.experience} years</p>
                <p>Certifications: {tutor.certifications.join(', ')}</p>
                <p>Skills: {tutor.skills.join(', ')}</p>
                <a href = {`https://www.google.com/maps?q=${tutor.latitude},${tutor.longitude}`} target="_blank">Live Location</a>
              </div>
            </div>
          </div>
          <Appp skills = {tutor.skills} className="barchart"/>
          </>
        );
      }
}

export default TutorMoreDetails