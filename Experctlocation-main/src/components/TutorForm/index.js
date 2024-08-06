import React, { useState,useEffect } from 'react';
//import axios from 'axios';
import './index.css'; // Import your CSS file

const TutorForm = () => {
  const [formData, setFormData] = useState({
    about: '',
    contact: '',
    address: '',
    domain: '',
    certifications: [],
    experience: '',
    skills: [],
    latitude:null,
    longitude:null
  });

  const token = localStorage.getItem("token")
    console.log(token)
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await fetch('http://localhost:3000/tutors/profile/1', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              mode: 'cors',
            });
            const data = await response.json();
            console.log(data);

            setFormData({
              username: data.profile.username,
              email: data.profile.email,
              about: data.profile.about || '',
              contact: data.profile.contact || '',
              address: data.profile.address || '',
              domain:data.profile.domain || "",
              skills:data.profile.skills || "", 
              certifications:data.profile.skills || "",
              experience:data.profile.experience || "",
              profilePic:data.profile.profilePic || "",
              
            });
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        };
      
        if (token) {
          fetchUserProfile();
        }
      }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCertificationsChange = (e) => {
    const certifications = e.target.value.split(',');
    setFormData({ ...formData, certifications });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',');
    setFormData({ ...formData, skills });
  };

  const handleFileChange = async (e) => {
    var reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])  
    reader.onload = () =>{
      console.log(reader.result)
      setFormData({...formData,profilePic:reader.result})
    }
};

const handleLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
        })
      },
      (error) => {
        console.error('Error getting location:', error.message);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        const { username, email, ...updatedData } = formData;
  
        const response = await fetch('http://localhost:3000/tutors/update-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
          body: JSON.stringify(updatedData),
        });
  
        const data = await response.json();
        console.log('Form submitted:', data);
        alert(`${data.message}`)
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    console.log('Form submitted:', formData);
  };

  return (
    <div className="tutor-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="about">About</label>
          <textarea
            name="about"
            id="about"
            value={formData.about}
            onChange={handleChange}
            className='form-textarea'
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="domain">Domain</label>
          <input
            type="text"
            name="domain"
            id="domain"
            value={formData.domain}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="certifications">Certifications (comma-separated)</label>
          <input
            type="text"
            name="certifications"
            id="certifications"
            value={formData.certifications.join(',')}
            onChange={handleCertificationsChange}
            className='form-input'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="experience">Experience (years)</label>
          <input
            type="number"
            name="experience"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={formData.skills.join(',')}
            onChange={handleSkillsChange}
            className='form-input'
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type={"file"}
            name="profilePic"
            id="profilePic"
            onChange={handleFileChange}
          />
          <img src = {formData.profilePic} alt = "pro" style={{height:"100px",width:"100px"}}/>
          </div>
          <button className="location-button" type="button" onClick={handleLocation}>
          Get Live Location
        </button>
        <button className = "tutor-form-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TutorForm;
