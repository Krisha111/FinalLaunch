// MainPageRegularReels.js
import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

export default function MainPageRegularReels({ reel,isActive }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoUrl = reel.videoUrl || reel.photoReelImages?.[0];

    // Auto play/pause when active changes
  React.useEffect(() => {
    setIsPlaying(isActive);
  }, [isActive]);

  const handlePress = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <TouchableOpacity onPress={handlePress}
     style={styles.videoCurious}
     activeOpacity={0.9}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="cover"
        paused={!isPlaying} // controls play/pause
        repeat // loop
       muted={false} // mute video
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  videoCurious: {
  
   width:"100%",
   height:"100%",  
   backgroundColor:"black"        // fill parent container
  },
 
  video: {
    
     width:"100%",
   height:"100%"  
      // fill parent height
  },
});
