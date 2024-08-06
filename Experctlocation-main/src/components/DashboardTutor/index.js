
//import DashboardHeader from "../DashboardHeader"
import DashboardTutorHeader from "../DashboardTutorHeader"
import Post from "../Posts"
//import ProfileDetails from "../StudentProfileDetails"
import TutorProfileDetails from "../TutorProfileDetails"


import "./index.css"

const DashboardTutor = () =>{
  
   return(
   <div>
    <DashboardTutorHeader />
    <div className="dashboard-body">
    <TutorProfileDetails/>
    <Post/>
    </div>

   </div>
)}

export default DashboardTutor