import React, { useState, useEffect, useRef } from 'react';
import '../../../Styles/Explore/PopUp/Comment.css';
import { IconButton } from '@mui/material';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { AiFillPicture } from 'react-icons/ai';
import { FaLocationDot } from 'react-icons/fa6';
import PostComment from './PostComment';
import { useDispatch, useSelector } from 'react-redux';
import { commentOnPost, fetchPosts } from '../../../../Redux/Slices/Profile/postNewDrop';
import { fetchHighlights } from '../../../../Redux/Slices/Profile/highNewDrop';

export default function Comment({ postId, contentType }) {
  const dispatch = useDispatch();
  const [currentComment, setCurrentComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const fileInputRef = useRef(null);

  const {
    vibeScript,
    location,

  } = useSelector((state) => state.post);

  const posts = useSelector((state) => state.postNewDrop.posts);
  const post = posts.find((p) => p._id === postId);


  // useEffect(() => {
  //   // if (!post) {
  //   if (contentType === 'posts') {
  //     dispatch(fetchPosts());
  //   } else if (contentType === 'highlights') {
  //     dispatch(fetchHighlights());
  //   }

  //   // }

  // }, [dispatch, post]);

  const comments = post?.comments || [];

  const handleSendComment = () => {
    if (!currentComment.trim() && !imagePreview && audioChunks.length === 0) return;

    // 🎤 If recording audio
    if (audioChunks.length > 0) {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result;
        dispatch(commentOnPost({
          postId,
          username: 'Krisha',
          text: `<audio controls src="${base64Audio}"></audio>`,
          contentType
        })).then(() => {
          setAudioChunks([]);
          dispatch(fetchPosts());
        });
      };
      reader.readAsDataURL(blob);
      return;
    }

    // 🖼 If image
    if (imagePreview) {
      dispatch(commentOnPost({
        postId,
        username: 'Krisha',
        text: `<img src="${imagePreview}" alt="comment image" />`
        ,
        contentType,
      })).then(() => {
        setCurrentComment('');
        setImagePreview(null);
        if (contentType === 'posts') {
          dispatch(fetchPosts());
        } else if (contentType === 'highlights') {
          dispatch(fetchHighlights());
        }

      });
      return;
    }

    // 📝 If normal text
    dispatch(commentOnPost({
      postId,
      username: 'Krisha',
      text: currentComment,
      contentType,
    })).then(() => {
      setCurrentComment('');
      if (contentType === 'posts') {
        dispatch(fetchPosts());
      } else if (contentType === 'highlights') {
        dispatch(fetchHighlights());
      }

    });
  };

  const handleFileIconClick = () => 
    fileInputRef.current.click();

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setCurrentComment('');
    };
    reader.readAsDataURL(file);
  }

  // ✅ Reset the input value so selecting the same file works again
  e.target.value = '';
};


  const toggleRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => setAudioChunks(chunks);

      recorder.start();
      setIsRecording(true);
    } else {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder?.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  return (
    <div className='commentBoxPostPopUpNavigate'>
      <div className='postPopUpDescriptionTopContainer'>
        <div className='postBioImageProfileMeContainer'>
          {vibeScript}
          <div className='PostPopUpLocationAndTimeContainer'>
            <div className='placePostPopUpContainer'>
              <div className='postImageHeaderPostPopUpLocation'>
                <div className='locationIcon'>
                  <FaLocationDot color='white' fontSize={12} />
                </div>
                <div className='locationPostPopUpPlace'>{location}</div>
              </div>
            </div>
            <div className='reactTimeAgoPostPopUpImage'>5hrs ago</div>
          </div>
        </div>

        <div className='postCommentBody'>
          {[...comments].reverse().map((comment, index) => (
            <PostComment
              key={index}
              text={comment.text}
              username={comment.username}
              timestamp={comment.timestamp}
            />
          ))}
        </div>
      </div>

      <div className='postPopUpDescriptionBottomContainer'>
        <div className='postCommentFooter'>
          <div className='postInputBox'>

            {/* 🎤 Microphone Toggle */}
            <IconButton onClick={toggleRecording} style={{ color: isRecording ? 'red' : 'inherit' }}>
              <FaMicrophoneAlt className='postCommentIcons' />
            </IconButton>

            {/* 📥 Comment Input or Image Preview */}
            <div className='postFooterInput'>
              {imagePreview ? (
                <div className='imagePreviewComment'>
                  <img
                    src={imagePreview}
                    alt='preview'
                    style={{ maxHeight: '40px', borderRadius: '5px' }}
                  />
                </div>
              ) : (
                <input
                  type='text'
                  className='postInputComment'
                  value={currentComment}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                  onChange={(e) => setCurrentComment(e.target.value)}
                  placeholder={isRecording ? 'Recording...' : 'Write a comment...'}
                  disabled={isRecording}
                />
              )}
            </div>

            {/* 🖼 File Upload */}
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <IconButton onClick={handleFileIconClick}>
              <AiFillPicture className='postCommentIcons' />
            </IconButton>

            {/* 📤 Send */}
            <IconButton onClick={handleSendComment}>
              <IoSend className='postCommentIcons' />
            </IconButton>

          </div>
        </div>
      </div>
    </div>
  );
}
