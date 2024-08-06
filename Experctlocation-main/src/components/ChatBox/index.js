import { Component } from "react";
import { IoIosSend } from "react-icons/io";
import "./index.css"

class ChatBox extends Component{
    state = {content:""}

    sendMessage = async (recId) => {
        // const {openChatBox} = this.props
        const {content} =  this.state
        const token = localStorage.getItem("token")
        try {
          if (!content) {
            alert("Empty Messages Can't Send")
            return;
          }
          const response = await fetch('http://localhost:3000/send-message', {
            method: 'POST',
            headers: {
             'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            mode:"cors",
            body: JSON.stringify({
              receiverId: recId,
              content: content,
            }),
          });
          this.setState({content:""})
          if (!response.ok) {
            throw new Error('Failed to send message');
            // this.openChatBox(recId)

          }
          const responseData = await response.json();
          console.log(responseData.message);

        } catch (error) {
          console.error('Error sending message:', error.message);
        }
      };

    render(){
        const {show,message} = this.props
        console.log("show",show)
        console.log("mess",message)
        // const idd = show._id ? show._id : show.studentId
        const {content} = this.state
      return(
            <div className="chat-body-container">
                {show.username ?(
                    <>
                     <div className="chat-header">
                     <img src = {show.profilePic} alt="profile" className="chat-box-profile"/>
                     <h1 className="chat-box-username">{show.username}</h1>
                     </div>
                     <div className="chat-body">
                         <ul className="messages-list">
                            {message.map(each =>(
                                <li className={each.receiverId ===  show._id?  "reply-messages" :"send-messages"} key = {each._id}>
                                {each.content}
                              </li>
                            ))}
                         </ul>
                     </div>
                     <div className="message-input-container">
                        <input type="text" placeholder="Enter Your Message..." className="message-input" onChange={(e) =>{this.setState({content:e.target.value})}} value ={content} />
                        <IoIosSend className="send-icon" onClick={() =>{this.sendMessage(show._id)}} style={{cursor:"pointer"}}/>
                     </div>
                     </>
                ):(
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100%"}}>
                        <h1 style={{textAlign:"center",fontStyle:"italic"}}>Start Conversation With<br/> your Connections</h1>
                    </div>
                )}
            </div>
        )
    }
}

export default ChatBox