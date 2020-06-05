import React from 'react';
import ChatForm from './chat_form';
import Modal from 'react-modal'
import EditChannelContainer from '../channels/channel_CRUD/edit_channel_container';
import { BsFillPersonLinesFill } from 'react-icons/bs'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
class ChannelChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      showEditModal: false,
      active: true
    };
    this.bottom = React.createRef();
    this.toggleClass = this.toggleClass.bind(this);
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);
    this.handleOpenEditModal = this.handleOpenEditModal.bind(this);
  }

  componentDidMount() {
    let channelId = this.props.channels[this.props.match.params.channelId]
    App.cable.subscriptions.create(
      { channel: "ChatChannel", channelId: channelId },
      {
        received: message => {
          this.setState({
            messages: this.state.messages.concat(message)
          });
        },
        speak: function(message) {
          return this.perform("speak", message)
        }
      }
    );
    // this.props.getServer(parseInt(this.props.match.params.serverId))
  }

  componentDidUpdate() {
    this.bottom.current.scrollIntoView(); // ({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  handleOpenEditModal() {
    this.setState({ showEditModal: true });
  }

  handleCloseEditModal() {
    this.setState({ showEditModal: false });
  }
  
  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState })
  }
  
  render() {
    let currentChannel = this.props.channels[this.props.match.params.channelId]
    let currentServer = this.props.servers[this.props.match.params.serverId]
    let nameDisplay = currentChannel?.name // same as currentChannel ? currentChannel.name : null
    let messageList;
    if (currentChannel) {
      let filteredMessages = this.props.messages.concat(this.state.messages).filter(message => {
        return message.channel_id === currentChannel.id
      });
      messageList = filteredMessages.map((message, idx) => {
        return (
          <div key={idx} id="new-message">
            <img id="message-avatar" src={this.props.users[message.author_id]?.photoURL || window.logo_head_white} />
            <div id="message-content-box">
              <p id="sender-name">{this.props.users[message.author_id]?.username}</p>
              <p id="sender-message">{message.body}</p>
            </div>
          </div>
        );
      });
    }

    return (
      <div id="channel-chat-container">
        <ToastContainer id="toast" position="top-center" />
        <div id="channel-chat-header">
          <p id="channel-chat-header-hash">#</p>
          <p id="channel-chat-header-name">{ nameDisplay }</p>
          <div id="members-list-icon" onClick={this.toggleClass}><BsFillPersonLinesFill size={ 22 } /></div>
          <p id="member-list-text">Member List</p>
        </div>
        <div id="chat-seperator">
          <div id="channel-chat-box">
            <div id="chat-box">
              <div id="message-list">
                <div id="chat-box-welcome">
                  <p id="welcome-text-main">Welcome to #{nameDisplay}!</p>
                  <p id="welcome-text-sub">This is the start of your #{nameDisplay} plot</p>
                  <Modal
                    id="channel-edit-modal"
                    isOpen={this.state.showEditModal}
                    contentLabel="Delete Server Modal"
                    onRequestClose={this.handleCloseEditModal}
                    style={{
                      content: {
                        top: '50%',
                        left: '50%',
                        right: '0',
                        bottom: '0',
                        marginLeft: "-245px",
                        marginTop: "-175px",
                        overflow: "hidden",
                        marginTop: "-170px",
                        width: "410px",
                        height: "220px",
                        backgroundColor: "#36393f",
                        border: "none",
                        color: "white"
                      },
                      overlay: {
                        position: 'fixed',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        zIndex: '50'
                      }
                    }}
                  >
                    <EditChannelContainer
                      channelName={currentChannel ? currentChannel.name : null}
                      channelId={currentChannel ? currentChannel.id : null}
                      closeModal={this.handleCloseEditModal}
                    />
                  </Modal>
                  <label id="welcome-text-edit-channel" onClick={this.handleOpenEditModal}>Edit Channel</label>
                </div>
                { messageList }
                <div ref={this.bottom} id="spacer"/>
              </div>
              <ChatForm authorId={this.props.currentUser.id} channel={currentChannel} />
            </div>
          </div>
          <div className={this.state.active ? "members-box" : null}> {/*animate__animated animate__fadeInRightBig*/}
            {
              this.props.members.length && this.state.active ? this.props.members.map((member, idx) => (
                <div key={idx} id="member-bar">
                  <img id="members-default-logo" src={member?.photoURL || window.logo_head_white} />
                  <p id="member-username">
                    { member?.username }
                  </p>
                  {
                    member?.id == currentServer?.owner_id ? <p id="server-owner-title">( owner )</p> : null
                  }
                </div>
              )) : null
            }
          </div>
          <div id="filler" />
        </div>
      </div>
    )
  }
}

export default ChannelChat;