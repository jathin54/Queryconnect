import { Component } from "react";
import Post from "../Posts";
import NewConnection from "../NewConnection";
import "./index.css"

class UserOptions extends Component{
        state = {
            showPost:false,
            showNewConnections:false
        }
        onClickPost = () =>{
            this.setState({showPost:true,showNewConnections:false })
        }
        onClickNewConnection = () =>{
            this.setState({showPost:false,showNewConnections:true})
        }
            render(){
                const {showPost,showNewConnections} = this.state
                return(
                <div className="user-post-container">
                    <div className="user-option-buttons">
                        <button className="user-post-button" onClick={this.onClickPost}>Post</button>
                        <button className="add-new-connections" onClick={this.onClickNewConnection}>New Connections</button>
                    </div>
                    <div className="options-container">
                        {showPost && <Post/>}
                        {showNewConnections && <NewConnection/>}
                    </div>
                    </div>
                )

            }
}

export default UserOptions