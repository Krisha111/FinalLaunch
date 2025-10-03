// src/components/SubComponents/Profile/SubProfile/Reels.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { setSelectedPost } from '../../Redux/Slice/Explore/ImagePopUp/ImagePopUpExplore.js';
import { fetchReelsByUserId } from '../../Redux/Slice/Profile/reelNewDrop.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const numColumns = 3; // 3 columns per row
const screenWidth = Dimensions.get('window').width;
const itemMargin = 4;
const itemSize = (screenWidth - itemMargin * (numColumns * 2)) / numColumns;

export default function Reels({ userId }) {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const loggedInUser = useSelector((state) => state.signUpAuth.user);
  const routeUserId = route.params?.userId;
  const userIdToFetch = userId || loggedInUser?._id; 
  const contentRef = useRef(null);

  const { reels = [], loading, error } = useSelector(
    (state) => state.reelNewDrop || {}
  );

  useEffect(() => {
    if (userIdToFetch) {
      dispatch(fetchReelsByUserId(userIdToFetch));
    }
  }, [dispatch, userIdToFetch]);


  const handleImageClick = (reel) => {
    dispatch(setSelectedPost({ ...reel, contentType: 'reel' }));
    navigation.navigate("ImagePopUpScreen");
  };

  const renderItem = ({ item }) => {
    const imageUri = item.posterImage || (item.photoReelImages && item.photoReelImages[0]);

    return (
      <TouchableOpacity
        style={[styles.postItem, { width: itemSize, height: itemSize }]}
        onPress={() => handleImageClick(item)}
        activeOpacity={0.8}
      >
        <View style={styles.iconRow}>
          <MaterialCommunityIcons
            name="filmstrip"
            size={16}
            style={styles.hashtagIcon}
          />
        </View>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.noImage]}>
            <MaterialCommunityIcons name="film" size={24} color="#777" />
            <Text style={styles.noImageText}>No preview</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading reels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error: {typeof error === 'string' ? error : error?.message || 'Something went wrong'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} ref={contentRef}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={10}
        showsVerticalScrollIndicator={false}   // hide vertical scrollbar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: itemMargin,
    paddingVertical: itemMargin,
  },
  postItem: {
    margin: itemMargin,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    position: 'absolute',
    zIndex: 3,
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 4,
    borderRadius: 16,
  },
  hashtagIcon: {
    color: '#333',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 4,
    color: '#666',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: 8,
    color: '#666',
  },
  errorText: {
    color: 'red',
  },
});
