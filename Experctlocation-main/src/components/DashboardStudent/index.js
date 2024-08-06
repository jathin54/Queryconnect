
import DashboardHeader from "../DashboardHeader"
import NewConnection from "../NewConnection"
import StudentProfileDetails from "../StudentProfileDetails"


import "./index.css"

const DashboardStudent = () =>{
  
   const list = "dashboard-student"
   return(
   <div>
    <DashboardHeader options = {list}/>
    <div className="dashboard-body">
    <StudentProfileDetails/>
    <NewConnection/>
    </div>
    
   </div>
)}

export default DashboardStudent