import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import your CSS file

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [role,setRole] = useState("user")

  const roleHandleChange =(e) =>{
    setRole(e.target.value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('Form submitted:', formData);
    try {
      console.log(role)
      const apiUrl = role === 'user' ? 'http://localhost:3000/students/register' : 'http://localhost:3000/tutors/register';
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(formData),
      };

      const response = await fetch(apiUrl, options);
      const data = await response.json();
      console.log(data)
      if (response.status === 201) {
        if(role === 'user')
        {
              navigate('/student/login');
        }
        else
              navigate('/tutor/login');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle registration error here (e.g., display an error message to the user)
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={roleHandleChange}
          >
            <option value="user">Student</option>
            <option value="tutor">Tutor</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        Have an Account? <a href="/login">Login Now</a>
      </div>
    </div>
  );
};

export default RegistrationForm;