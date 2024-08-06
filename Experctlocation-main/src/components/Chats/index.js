
import { Component } from "react";
import DashboardHeader from "../DashboardHeader";
import ChatBox from "../ChatBox";
import MyChats from "../MyChats";
import "./index.css"
//import DashboardStudent from "../DashboardStudent";
import DashboardTutorHeader from "../DashboardTutorHeader";
class Chats extends Component{
    state = {connections:[],chatbox:{},message:[]}


    componentDidMount(){
        this.fetchMyConnections()
    }

    fetchMyConnections = async () =>{
        try {
            const token1 = localStorage.getItem("student");
            const token = localStorage.getItem("token")
            const apiUrl = token1
              ? "http://localhost:3000/students/connected-tutors"
              : "http://localhost:3000/tutors/connected-students";
      
            const response = await fetch(apiUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              mode: "cors",
            });
            const data = await response.json();
            //console.log("data",data)
            if (response.ok) {
              if(token1)
                this.setState({connections : data.connectedTutors });
              else
              
              this.setState({connections : data.connectedStudents });
            } else {
              console.error("Error fetching notifications:", data.message);
            }
          } catch (error) {
            console.error("Error fetching notifications:", error);
          }
        };

        openChatBox = async (par) =>{
            this.setState({chatbox:{...par}})
            //const p = par._id ? par._id : par.studentId
            const token = localStorage.getItem("token")
            try {
            const response = await fetch(`http://localhost:3000/get-messages?receiverId=${par._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            mode:"cors"
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch messages');
          }
          const responseData = await response.json();
          console.log(responseData);
          this.setState({message:responseData.messages})
        //   if (responseData.messages && responseData.messages.length > 0) {
        //     responseData.messages.forEach((message) => {
        //       // Handle each message (e.g., update UI, display messages, etc.)
        //       console.log(`From ${message.senderId} to ${message.receiverId}: ${message.content}`);
        //     });
        //   } else {
        //     console.log('No messages available for this chat');
        //   }
      
          // Optionally, you can handle UI updates or other actions after fetching messages
        } catch (error) {
          console.error('Error fetching messages:', error.message);
          // Handle the error, display a message to the user, etc.
        }
        }
    render(){
        const token= localStorage.getItem("student")
        //const list = token ? '/dashboard-student' : '/dashboard-tutor';
        const {connections,chatbox,message} = this.state
        return(
            <div>
                {token ? <DashboardHeader/> : <DashboardTutorHeader/>}
                <div className="chats-body">
                <MyChats connections = {connections} openChatBox = {this.openChatBox}/>
                <ChatBox show = {chatbox} message = {message} openChatBox = {this.openChatBox} connections = {connections}/>
                </div>
            </div>
        )
    }
}

export default Chats