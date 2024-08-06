import React, {useEffect ,useState,} from 'react';
import { useNavigate } from 'react-router-dom';

import "./index.css"
const TutorProfileDetails = () => {
    const [formData, setFormData] = useState({
        username: '',
        about: 'Web Developer',
        email: '',
        contact: '123-456-7890',
        address: '123 Street, City',
        profilePic: '',
      });
      const navigate = useNavigate();

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
            localStorage.setItem("tutorId", data.profile._id);
            setFormData({
              username: data.profile.username,
              email: data.profile.email,
              about: data.profile.about || '',
              contact: data.profile.contact || '',
              address: data.profile.address || '',
              profilePic:data.profile.profilePic || ""
            });
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        };
      
        if (token) {
          fetchUserProfile();
        }
      }, [token]);

      const moveToEdit = () =>{
        navigate("/tutor-form")
  }

        return(
            <div className="profile-details-container">
                <img src = {formData.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="profile" className="profile-pic"/>
                <div className="profile-details">
                    <h1 className="user-name">{formData.username}</h1>
                    <h3 className="about-user">{formData.about ? `${formData.about}`:"Add About YourSelf"}</h3>
                    <h3 className="user-mail">{formData.email ? `${formData.email}`:`Add your Email`}</h3>
                    <h3 className="user-number">{formData.contact ? `${formData.contact}`:"Add your contact"}</h3>
                    <h3>{formData.address ? `${formData.address}` : "Add your address"}</h3>
                    <button className="edit-profile-details" onClick={moveToEdit}>Edit</button>
                    <a href = "tutor-details" className="link-to-show-more" >Show More Details</a>
                </div>

            </div>
        )
}

export default TutorProfileDetails