// ImagesProfileRow.js
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native';
import axios from 'axios';

const URL = 'https://api.unsplash.com/search/photos';
const Access_key = '0b_PBFtOzp79VOLz--Da8Qis4_l8mv1gtw4-Ne-W2Rs';

export default function ImagesProfileRow() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const result = await axios.get(
          `${URL}?page=1&query=nature&per_page=5&client_id=${Access_key}`
        );
        setImages(result.data.results || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]);
      }
    };
    getImage();
  }, []);

  if (!images || images.length === 0) {
    return <Text style={styles.loadingText}>Loading images...</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      {images.map((image, index) => (
        <View
          key={index}
          style={[
            styles.profileItem,
            index !== 0 && { marginLeft: -10 }, // overlap for all but first
          ]}
        >
          <Image
            source={{ uri: image.urls.thumb }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileItem: {
    width: 30,
    height: 30,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
});
