// MainPageRegularReels.js
import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

export default function MainPageRegularReels({ reel }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = reel.videoUrl || reel.photoReelImages?.[0];

  const handlePress = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="cover"
        paused={!isPlaying} // controls play/pause
        repeat // loop
        muted // mute video
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  video: {
    width: width,
    height: width * 1.77, // 16:9 aspect ratio, adjust as needed
    backgroundColor: '#000',
  },
});
