import React, { useState,useEffect } from 'react';
//import { imagetoBase64 } from '../imagetoBase64';
import './index.css';

const EditProfileForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        about: 'Web Developer',
        email: '',
        contact: '123-456-7890',
        address: '123 Street, City',
        profilePic: '',
      });

    const token = localStorage.getItem("token")
    console.log(token)
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await fetch('http://localhost:3000/students/profile', {
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

  const handleFileChange = async (e) => {
    
      var reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])  
      reader.onload = () =>{
        console.log(reader.result)
        setFormData({...formData,profilePic:reader.result})
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {

        const { username, email, ...updatedData } = formData;
  
        const response = await fetch('http://localhost:3000/students/update-info', {
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
        alert("Profile Updated Successfully")
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    console.log('Form submitted:', formData);
  };



  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="about">About</label>
          <textarea
            name="about"
            id="about"
            value={formData.about}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
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
          <img src = {formData.profilePic} alt = "pro" style={{height:"100px",width:"100px"}}/>        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
