// src/components/SubComponents/ReelChat/Reel.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setReelScript, setReelLocation } from '../../../../Redux/MakingNewDrop/Reel.js';
import { setaddSlideReels } from '../../../../Redux/MakingNewDrop/AddDrop.js';
import ReelNewDrop from '../../ReelChat/NewPhotoPosting/ReelNewDrop.js';
import * as ImagePicker from 'react-native-image-picker';

export default function Reel() {
  const { reelScript, reelLocation } = useSelector((state) => state.reel);
  const addSlideReels = useSelector((state) => state.addDrop.addSlideReels);
  const dispatch = useDispatch();

  const [postType, setPostType] = useState('regular');
  const [poster, setPoster] = useState(null);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setPoster(response.assets[0]);
        }
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {addSlideReels ? (
        <>
          <View style={styles.vibeScriptContainer}>
            <Text style={styles.vibeScriptTitle}>Reel Script</Text>
            <TextInput
              style={styles.vibeScriptInput}
              value={reelScript}
              onChangeText={(text) => dispatch(setReelScript(text))}
            />
          </View>

          <View style={styles.vibeScriptContainer}>
            <Text style={styles.vibeScriptTitle}>Location</Text>
            <TextInput
              style={styles.vibeScriptInput}
              value={reelLocation}
              onChangeText={(text) => dispatch(setReelLocation(text))}
            />
          </View>

          {/* Poster Upload */}
          <View style={styles.vibeScriptContainer}>
            <Text style={styles.vibeScriptTitle}>Cover Photo (Poster)</Text>
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Pick Image</Text>
            </TouchableOpacity>
            {poster && (
              <Image
                source={{ uri: poster.uri }}
                style={styles.posterPreview}
              />
            )}
          </View>

          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              onPress={() => dispatch(setaddSlideReels(false))}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ReelNewDrop postType={postType} poster={poster} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  vibeScriptContainer: {
    marginBottom: 20,
  },
  vibeScriptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vibeScriptInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  posterPreview: {
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
