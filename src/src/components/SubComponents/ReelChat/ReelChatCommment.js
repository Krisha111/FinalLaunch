// src/components/ReelChat/ReelChatCommment.js
import React, { useState, useEffect } from 'react';
import '../../Styles/ReelChat/reelChatComments.css';
import Comments from './Comments';
import EmojiPop from '../PopUps/EmojiPickerPopup';

export default function ReelChatCommment({ comments }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentComment, setCurrentComment] = useState([]);
  const [allComments, setAllComments] = useState(comments || []);

  // Audio recording
  const handleStartRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
        setAudioBlob(blob);
      };

      recorder.start();
    } else {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  // Playback recorded audio
  const handlePlayback = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Send new comment
  const handleSendComment = () => {
    if (currentComment.trim()) {
      const newComment = {
        _id: Date.now(),
        text: currentComment,
        user: { username: 'You', profileImage: '' },
        createdAt: new Date().toISOString(),
      };
      setAllComments([newComment, ...allComments]);
      setCurrentComment('');
    }
  };

  // Emoji selection
  const addEmoji = (emoji) => {
    setCurrentComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

  return (
    <div className="reelChatCommmentContainer">
      {/* Header */}
      <div className="reelChatCommentTitle">
        <p>Comments</p>
      </div>

      {/* Comments Body */}
      <div className="reelChatCommentBody">
        {[...allComments]
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
          )
          .map((comment, index) => (
            <Comments
              key={comment._id || index}
              profileImage={comment.user?.profileImage}
              username={comment.user?.username}
              text={comment.text}
              createdAt={comment.createdAt}
            />
          ))}
      </div>

      {/* New Comment Input */}
      <div className="commentInputContainer">
        <input
          type="text"
          placeholder="Add a comment..."
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
        />
        <button onClick={handleSendComment}>Send</button>
        <button onClick={() => setShowEmojiPicker(true)}>😊</button>
        <button onClick={handleStartRecording}>
          {isRecording ? 'Stop Recording' : 'Record Audio'}
        </button>
        {audioBlob && <button onClick={handlePlayback}>Play Audio</button>}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPop onClose={() => setShowEmojiPicker(false)} onEmojiSelect={addEmoji} />
      )}
    </div>
  );
}
