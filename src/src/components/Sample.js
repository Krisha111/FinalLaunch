// Sampleeee.js
import React, { useEffect, useRef, useState } from 'react';
import RegularReels from './SubComponents/ReelChat/RegularReels';
import './Styles/ReelSide.css';
import './Styles/ReelTalk.css';
import { io } from 'socket.io-client';
import '../../src/components/sampleeee.css';
import reelchat from '../reelchat.mp4';
import reelchatt from '../shreya.mp4';
import reelchattt from '../shehzaankhan.mp4';
import '../../src/components/sampleeee2.css';
import { IoPersonSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import OnlineUsersSuggestions from './SubComponents/ReelChat/OnlineUsersSuggestions';
import { useSelector ,useDispatch} from 'react-redux';
import { fetchAllReels } from '../Redux/Slices/Profile/reelNewDrop.js';
import { IconButton } from '@mui/material';
import { BsEmojiKissFill } from "react-icons/bs";
import { FaMicrophoneAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { AiFillPicture } from "react-icons/ai";
import EmojiPicker from 'emoji-picker-react';

const socket = io('http://localhost:8000');

export default function Sampleeee() {


  // Redux username
  const signUpUserName = useSelector(
    (state) => state.signInAuth?.user?.username ?? ''
  );
  const userId = useSelector((state) => state.signInAuth?.user?._id);

  const profileImage = useSelector(
    (state) => state.profileInformation?.profileImage
  );
  // useEffect(() => {
  //   if (userId) {
  //     socket.emit('register', { userId }); // send only real DB id
  //     setUsername(signUpUserName);
  //   }
  // }, [userId, signUpUserName]);
const dispatch = useDispatch();
  const [username, setUsername] = useState(signUpUserName);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatWith, setChatWith] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  // chat items: { sender, message (raw string), parsed } where parsed is null or {type, data, name}
  const [chat, setChat] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [whoIsAdmin, setWhoIsAdmin] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);


  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Hidden file input ref for image upload
  const fileInputRef = useRef(null);

const reels = useSelector((state) => state.reelNewDrop.reels || []);

useEffect(() => {
  dispatch(fetchAllReels());
}, [dispatch]);

  // Auto-register with Redux username
 useEffect(() => {
  if (signUpUserName && userId) {
    socket.emit('register', {
      username: signUpUserName,
      userId: userId, // ✅ actual DB id, not socket.id
    });
    setUsername(signUpUserName);
  }
}, [signUpUserName, userId]);


  // Message handler (single listener)
  useEffect(() => {
    const handleReceiveMessage = ({ sender, message }) => {
      let parsed = null;
      if (typeof message === 'string') {
        try {
          const obj = JSON.parse(message);
          if (obj && obj.type) parsed = obj;
        } catch (err) {
          parsed = null; // not JSON -> plain text
        }
      }
      setChat((prev) => [...prev, { sender, message, parsed }]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  // Other socket listeners
  useEffect(() => {
    // socket.on('active_users', (users) => {
    //   setOnlineUsers(users);
    // });
    socket.on('active_users', (users) => {
      // console.log("✅ Active users received:", users);
      users.forEach(user => {
        // console.log("Krishu",user.username, user.bio,",,,");
      });

      setOnlineUsers(users); // still update state
    });
    socket.on('receive_invite', ({ from }) => {
      if (window.confirm(`Accept chat request from ${from}?`)) {
        socket.emit('accept_invite', { from });
        setChatWith(from);
        setWhoIsAdmin(from);
      }
    });

    socket.on('invite_accepted', ({ by, room }) => {
      setRoom(room);
      setIsAdmin(true);
      setChatWith(by);
    });

    socket.on('joined_room', ({ room }) => {
      setIsAdmin(false);
      setRoom(room);
    });

    socket.on('sync_reel_index', (index) => {
      setActiveIndex(index);

      if (!isAdmin && videoRefs.current[index]) {
        videoRefs.current[index].scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
          const video = videoRefs.current[index];
          if (video) {
            video.play().catch((err) => console.log('Viewer autoplay failed:', err.message));
          }
        }, 300);
      }
    });

    socket.on('reel_play_state', ({ index, isPlaying }) => {
      const video = videoRefs.current[index];
      if (!video) return;
      if (isAdmin) return;

      if (isPlaying) {
        video.play().catch((err) => console.log('Viewer play error:', err.message));
      } else {
        video.pause();
      }
    });

    return () => {
      socket.off('active_users');
      socket.off('receive_invite');
      socket.off('invite_accepted');
      socket.off('joined_room');
      socket.off('sync_reel_index');
      socket.off('reel_play_state');
    };
  }, [isAdmin]);

  // Intersection observer for reels
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (isAdmin) {
              socket.emit('change_reel_index', { room, index });
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((el) => el && observer.observe(el));
    return () => videoRefs.current.forEach((el) => el && observer.unobserve(el));
  }, [isAdmin, room]);

  const setVideoRef = (el, index) => {
    videoRefs.current[index] = el;
  };

  const sendInvite = (to) => {
    socket.emit('send_invite', { to });
  };

  // Send plain text message
  const sendMessage = () => {
    if (message.trim() && room) {
      // send as a plain string (server will forward this string)
      socket.emit('send_message', { room, message: message.trim(), sender: username });
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  // Send a JSON-stringified media message (image/audio)
  const sendMediaMessage = ({ type, data, name }) => {
    if (!room) return;
    const payload = JSON.stringify({ type, data, name });
    socket.emit('send_message', { room, message: payload, sender: username });
  };

  // Image upload handler
  const handleImageSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result; // data:image/...
      sendMediaMessage({ type: 'image', data: dataUrl, name: file.name });
      // clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleImageIconClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Recording handlers
  const handleStartStopRecording = async () => {
    if (!isRecording) {
      // start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size) audioChunksRef.current.push(ev.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          // convert to dataURL
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result; // data:audio/webm;base64,...
            sendMediaMessage({ type: 'audio', data: dataUrl, name: 'recording.webm' });
          };
          reader.readAsDataURL(blob);

          // stop all tracks
          try {
            stream.getTracks().forEach((t) => t.stop());
          } catch (e) { }
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone permission denied or error:', err);
      }
    } else {
      // stop recording
      const rec = mediaRecorderRef.current;
      if (rec && rec.state !== 'inactive') rec.stop();
      setIsRecording(false);
    }
  };

  // Cleanup recording tracks if any on unmount
  useEffect(() => {
    return () => {
      try {
        const rec = mediaRecorderRef.current;
        if (rec && rec.state !== 'inactive') rec.stop();
      } catch (e) { }
    };
  }, []);

  // Emoji select
  const onEmojiClick = (emojiData) => {
    // emojiData.emoji contains the character in emoji-picker-react
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Waiting for username before rendering
  if (!username) {
    return <div>Loading...</div>;
  }

  // If user hasn't joined a room yet, show online users list
  if (!room) {
    return (
      <div className="onlineUsersFullContainer">
        <div className="onlineUsersFullInnerContainer">
          <div className="onlineUsersTitleReelChat">
            <div className="onlineUsersTitleBox">ReelChatt</div>
            <div className="onlineUsersName">
              <div className="onlineUsersProfilePic">
                <div className="onlineUsersProfilePicOuter" >
                  <div className="onlineUsersProfilePicOuter">
                  {profileImage && profileImage.trim() !== "" ? (
                    <img
                      src={profileImage}
                      alt="Your profile"
                      className="profilePicOfChatWithPrinsu"
                    />
                  ) : (
                    <RxAvatar className="profilePicOfChatWithPrinsu" />
                  )}
                </div>
              </div>
              <div className="onlineUsersUserName">{username}</div>
              </div>
            </div>
          </div>

          <div className="OnlineUsersListContainer">
            <div className="titleOfOnlineUserSubComponent">Online Users...</div>
            <div className="onlineUserListOuterBox">
              {console.log("onlineUsers", reels.photoReelImages  )}
              {onlineUsers
                .filter((u) => u.username !== username)
                .map((u) => (
                  <div className="onlineUserListContainer" key={u.username}>
                    <div className="onlineUserNameTagContainer">
                      <div className="onlineUserListPhotoContainer">
                        <div className="onlineUserListPhotoContainerKrishyu">
                          {u.profileImage && u.profileImage.trim() !== "" ? (
                            <img
                              src={u.profileImage}
                              alt={u.username}
                              className="onlineUserListPhotoMeToo"
                            />
                          ) : (
                            <RxAvatar className="onlineUserListPhoto" />
                          )}

                        </div>
                      </div>
                      <div className="onlineUserListName">{u.username}</div>
                    </div>
                    <div className="bioForInvitingOnlineUsers">
                      {/* {u.bio || "No bio available"}
                      hdhhfhhfhfhhfhfhfhj shhshshshhshs hshhshshsh hshhshshsh
                      sggsgsggs sggsggsggsgsgsg sggsgsgsggs sgsggsgsggsgs g */}
                      {u.bio && u.bio.trim() !== "" ? u.bio : "Bio"}
                    </div>
                    <div className="onlineUserListInviteBox">
                      <div className="onlineUserListInviteBoxxy"
                        onClick={() => sendInvite(u.username)}>Invite</div>
                    </div>
                  </div>
                ))}
              {/* {console.log("profileImajjjge", profileImage)} */}
              {/* {onlineUsers
                .filter((u) => u !== username)
                .map((u) => (
                  <div className="onlineUserListContainer" key={u}>
                    <div className="onlineUserNameTagContainer">
                      <div className="onlineUserListPhotoContainer">
                        {/* <div className="onlineUserListPhoto" /> 
                        <img
                          src={u.profileImage || "/default.png"}
                          alt={u.username}
                          className="onlineUserListPhoto"
                        />
                      </div>
                      <div className="onlineUserListName">{u}</div>
                    </div>
                    <div className="bioForInvitingOnlineUsers">
                      hdhhfhhfhfhhfhfhfhj shhshshshhshs hshhshshsh hshhshshsh
                      sggsgsggs sggsggsggsgsgsg sggsgsgsggs sgsggsgsggsgs g
                    </div>
                    <div className="onlineUserListInviteBox">
                      <button onClick={() => sendInvite(u)}>Invite</button>
                    </div>
                  </div>
                ))} */}
            </div>
          </div>
          <div className="containerOfOnLineUsersFollowSuggestions">
            <div className="titleOfOnlineUserSubComponent">Suggestions...</div>
            <div>
              <OnlineUsersSuggestions />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat message renderer helper
  const renderMessageContent = (item) => {
    const { parsed, message } = item;
    if (parsed && parsed.type === 'image') {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={parsed.data}
            alt={parsed.name || 'image'}
            style={{ maxWidth: '200px', borderRadius: 8 }}
          />
        </div>
      );
    }
    if (parsed && parsed.type === 'audio') {
      return (
        <div>
          <audio controls src={parsed.data} style={{ width: 220 }} />
        </div>
      );
    }
    // fallback: plain text
    return <div>{message}</div>;
  };

  return (
    <div className="krishaContainer">
      <div className="krishaReelContainer">
        <div className="reelsContainer">
          <div className="theReelChatContainerBox">
            <div className="reelsMaincontainer">
              <div
                className="videoWrapper"
                style={{
                  scrollSnapType: isAdmin ? 'y mandatory' : undefined,
                  overflowY: isAdmin ? 'scroll' : 'hidden',
                }}
              >
                {reels.map((reel, index) => (
                  <RegularReels
                    key={index}
                    reel={reel}
                    index={index}
                    activeIndex={activeIndex}
                    setVideoRef={setVideoRef}
                    isAdmin={isAdmin}
                    socket={socket}
                    room={room}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chatSection">
        <div className="reelChatTitleOfChatFuntionlity">
          <div className="reelChatWithTitle">
            <div className="reelChatMainTitle">ReelChatt</div>
            <div className="profilePicOfChatWithOuter">
              <div className="profilePicOfChatWithMainProfileKissuBoosy">

                {profileImage && profileImage.trim() !== "" ? (
                  <img
                    src={profileImage}
                    alt="Your profile"
                    className="profilePicOfChatWithKissuBoosy"
                  />
                ) : (
                  <IoPersonSharp 
                  className="profilePicOfChatSannnWithKissuBoosy" />
                )}


              </div>
              <div className="nameOfPersonChattingWith">{chatWith}</div>
            </div>
          </div>
          <div className="whoIsAdminOfReelChat">
            <div className="whoIsAdminOfReelChatWritten">
              Admin: {isAdmin ? 'You are Admin' : `${chatWith} is Admin`}
            </div>
          </div>
        </div>

        <div className="reelChatChatFuntionalityContainer">
          <div className="chatMessages">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`chatBubble ${c.sender === username ? 'sent' : 'received'}`}
              >
                <div className="senderName">{c.sender}</div>
                <div className="messageText">{renderMessageContent(c)}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="reelChatSendButton" style={{ alignItems: 'center' }}>
          <div className="footerIconsCommentLeft" style={{ display: 'flex', gap: 8 }}>
            <IconButton onClick={() => setShowEmojiPicker((s) => !s)}>
              <BsEmojiKissFill className="commentIcons" />
            </IconButton>
            <IconButton onClick={handleStartStopRecording}>
              <FaMicrophoneAlt className="commentIcons" color={isRecording ? 'red' : 'black'} />
            </IconButton>
          </div>

          <div className="reelChatSendButtonInner" style={{ position: 'relative', flex: 1 }}>
            <input
              value={message}
              className="inputOfReelChatFunctionality"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
            />

            {/* Emoji picker overlay */}
            {showEmojiPicker && (
              <div style={{
                position: 'absolute',
                bottom: '55px',
                left: 0,
                zIndex: 50,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <div className="footerIconsCommentRight" style={{ display: 'flex', gap: 8 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelected}
            />
            <IconButton onClick={handleImageIconClick}>
              <AiFillPicture className="commentIcons" />
            </IconButton>
            <IconButton onClick={sendMessage}>
              <IoSend style={{ color: 'red' }} className="commentIcons" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
