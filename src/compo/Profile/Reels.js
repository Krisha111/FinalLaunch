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
  Platform,
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
  const loggedInUser = useSelector((state) => state.signUpAuth?.user);
  const routeUserId = route.params?.userId;
  // Priority: explicit prop userId -> route param -> logged in user's id
  const userIdToFetch = userId || routeUserId || loggedInUser?._id;
  const contentRef = useRef(null);

  // Expect shape in slice: { reels: [], loading: boolean, error: string|null }
  const { reels = [], loading = false, error = null } = useSelector(
    (state) => state.reelNewDrop || {}
  );

  useEffect(() => {
    // Only try to fetch if we have a user id
    if (userIdToFetch) {
      dispatch(fetchReelsByUserId(userIdToFetch));
    }
  }, [dispatch, userIdToFetch]);

  const handleImageClick = (reel) => {
    dispatch(setSelectedPost({ ...reel, contentType: 'reel' }));
    navigation.navigate('ImagePopUpScreen');
  };

  const renderItem = ({ item }) => {
    const imageUri =
      item?.posterImage ||
      (Array.isArray(item?.photoReelImages) && item.photoReelImages[0]) ||
      null;

    return (
      <TouchableOpacity
        style={[styles.postItem, { width: itemSize, height: itemSize }]}
        onPress={() => handleImageClick(item)}
        activeOpacity={0.8}
      >
        <View style={styles.iconRow}>
          <MaterialCommunityIcons name="filmstrip" size={16} style={styles.hashtagIcon} />
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbnail, styles.noImage]}>
            <MaterialCommunityIcons name="film" size={24} color="#777" />
            <Text style={styles.noImageText}>No preview</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // --- Loading state ---
  if (loading) {
    return (
      <View style={styles.centered}>
   
        <Text style={styles.statusText}>Loading reels...</Text>
      </View>
    );
  }

  // --- Real error (not "no reels") ---
  // Some backends return 404 or message "No reels found..." when user has none.
  // We'll treat that case as an empty state (not an error).
  const errorMessage = typeof error === 'string' ? error : error?.message || null;
  const isNoReelsError = errorMessage && /no reel|no reels|not found/i.test(errorMessage);

  if (error && !isNoReelsError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error: {errorMessage ?? 'Something went wrong while fetching reels.'}
        </Text>
      </View>
    );
  }

  // --- Empty state: user has no reels yet (or reels array is empty) ---
  const isEmpty = !reels || reels.length === 0;

  if (isEmpty) {
    return (
      <View style={styles.centered}>
       
        <Text style={styles.statusText}>No reels uploaded yet</Text>
        
      </View>
    );
  }

  // --- Normal view: show grid of reels ---
  return (
    <View style={styles.container} ref={contentRef}>
     
      <FlatList
        data={reels}
        keyExtractor={(item, index) =>
           item?._id ?? item?.id ?? String(index)}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={10}
        showsVerticalScrollIndicator={false}
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

    // ✅ Updated shadow (Expo SDK compatible)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      default: {
        boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
      },
    }),
    elevation: 1,

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
    padding: 20,
  },
  statusText: {
    marginTop: 8,
    color: 'black',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
