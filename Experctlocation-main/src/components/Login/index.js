import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import "./index.css"

const Login = () =>(
    <div className="login-container">
        <a href="/student/login" style={{textDecoration:"none"}}>
        <div className="card">
            <PiStudentBold className="icon"/>
            <h1>Student</h1>
        </div>
        </a>
        <a href="tutor/login" style={{textDecoration:"none"}}>
        <div className="card">
        <GiTeacher className="icon"/>
        <h1>Tutor</h1>
        </div>
        </a>
        
    </div>
)

export default Login