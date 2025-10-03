import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  setReelScript,
  setReelLocation,
} from '../../../Redux/Slice/MakingNewDrop/Reel.js';
import { setaddSlideReels } from '../../../Redux/Slice/MakingNewDrop/AddDrop.js';
import ReelNewDrop from '../../ReelChat/NewPhotoPosting/ReelNewDrop.js';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function Reel() {
  const { reelScript, reelLocation } = useSelector((state) => state.reel);
  const addSlideReels = useSelector((state) => state.addDrop.addSlideReels);
  const dispatch = useDispatch();
const navigation = useNavigation();
  const [postType, setPostType] = useState('regular');
  const [poster, setPoster] = useState(null);

  const selectPoster = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          setPoster(response.assets[0]);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
 
        <>
          {/* Reel Script */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reel Script</Text>
            <TextInput
              style={styles.input}
              value={reelScript}
              placeholder="Write your reel script..."
              onChangeText={(text) => dispatch(setReelScript(text))}
            />
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={reelLocation}
              placeholder="Enter location..."
              onChangeText={(text) => dispatch(setReelLocation(text))}
            />
          </View>

          {/* Poster Upload */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cover Photo (Poster)</Text>
            <TouchableOpacity style={styles.posterButton} onPress={selectPoster}>
              <Text style={styles.posterButtonText}>Select Poster</Text>
            </TouchableOpacity>
            {poster && (
              <Image
                source={{ uri: poster.uri }}
                style={styles.posterPreview}
              />
            )}
          </View>

          {/* NEXT Button */}
          <View style={styles.bottomButtonContainer}>
       
<TouchableOpacity
  style={styles.nextButton}
  onPress={() => {
    // Dispatch Redux action if needed
    dispatch(setaddSlideReels(false));
    
    // Navigate to your target screen
    navigation.navigate('ReelNewDropScreen', {
      postType: postType,
      poster: poster,
    });
  }}
>
              <Text style={styles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  posterButton: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#63e25e',
    borderRadius: 8,
    alignItems: 'center',
  },
  posterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  posterPreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginTop: 10,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#63e25e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
