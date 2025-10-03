// src/components/ReelChat/SuggestionRellChat.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function SuggestionRellChat() {
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const URL = 'https://api.unsplash.com/search/photos';
  const Access_key = '0b_PBFtOzp79VOLz--Da8Qis4_l8mv1gtw4-Ne-W2Rs';

  useEffect(() => {
    const getImage = async () => {
      try {
        const result = await axios.get(
          `${URL}?page=1&query=office&per_page=20&client_id=${Access_key}`
        );
        setImages(result.data.results);
      } catch (error) {
        console.log(error);
      }
    };
    getImage();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollToOffset({
      offset: direction === 'up' ? Math.max(scrollY._value - height / 2, 0) : scrollY._value + height / 2,
      animated: true,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.profilePostItem}
      onPress={() => setSelectedIndex(index)}
    >
      <Image
        source={{ uri: item.urls.small }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.scrollButton, styles.up]} onPress={() => scroll('up')}>
        <AntDesign name="up" size={20} color="black" />
      </TouchableOpacity>

      <Animated.FlatList
        ref={scrollRef}
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={[styles.scrollButton, styles.down]} onPress={() => scroll('down')}>
        <AntDesign name="down" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    position: 'relative',
  },
  flatListContent: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  profilePostItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrollButton: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -15 }],
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  up: {
    top: 10,
  },
  down: {
    bottom: 10,
  },
});
