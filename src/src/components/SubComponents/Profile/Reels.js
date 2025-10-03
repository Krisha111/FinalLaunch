// Reels.js (React Native)
import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReelsByUserId } from '../../../Redux/Slices/Profile/reelNewDrop';
import { setSelectedPost, toggleShowPopup } from '../../../Redux/Slices/Explore/ImagePopUp/ImagePopUpExplore';
import ImagePopUp from '../Explore/PopUp/ImagePopUp';
import { PiFilmReelFill } from 'react-icons/pi'; // replace with react-native-vector-icons if needed

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2; // Number of columns in grid
const ITEM_MARGIN = 10;
const ITEM_WIDTH = (SCREEN_WIDTH - (NUM_COLUMNS + 1) * ITEM_MARGIN) / NUM_COLUMNS;

export default function Reels({ route }) {
  const dispatch = useDispatch();
  const { id } = route?.params || {};
  const { reels, loading, error } = useSelector(state => state.reelNewDrop);
  const { showPopup } = useSelector(state => state.imagePopUpExplore);

  useEffect(() => {
    if (id) {
      dispatch(fetchReelsByUserId(id));
    }
  }, [id, dispatch]);

  const handleImageClick = (reel) => {
    dispatch(setSelectedPost({ ...reel, contentType: 'reel' }));
    dispatch(toggleShowPopup());
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Loading reels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleImageClick(item)}>
      <View style={styles.hashtagContainer}>
        <Text style={styles.hashtagIcon}>🎬</Text>
      </View>
      {item.posterImage || item.photoReelImages?.[0] ? (
        <Image
          source={{ uri: item.posterImage || item.photoReelImages[0] }}
          style={styles.image}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.flatListContainer}
      />
      {showPopup && <ImagePopUp />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ITEM_MARGIN / 2,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    aspectRatio: 1, // maintain square shape
    margin: ITEM_MARGIN / 2,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hashtagContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  hashtagIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
