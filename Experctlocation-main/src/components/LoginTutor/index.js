import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import your CSS file

const LoginTutorForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const url = "http://localhost:3000/tutors/login";
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(formData),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if(data.message === "Login successful"){
       console.log("tutor")
        localStorage.setItem('token', data.token);
        localStorage.setItem("tutor",data.token)
        localStorage.removeItem("student")
        navigate('/dashboard-tutor');
    }
    console.log('Login submitted:', formData);
    console.log('Login submitted:', formData);
  };

  return (
    <div className="auth-container">
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
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        Don't have an account? <a href="/registration">Register Now</a>
      </div>
    </div>
  );
};

export default LoginTutorForm;