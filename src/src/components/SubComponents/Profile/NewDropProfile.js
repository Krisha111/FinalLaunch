import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Reel from './NewDropOptions/Reel';
import ReelNewDrop from '../ReelChat/NewPhotoPosting/ReelNewDrop';

const filters = [
  { name: 'POST', image: require('../../../../src/post.png') },
  { name: 'MOMENT', image: require('../../../../src/moment.png') },
  { name: 'HIGHLIGHT', image: require('../../../../src/highlight.png') },
  { name: 'REEL', image: require('../../../../src/reel.png') },
  { name: 'THOUGHT', image: require('../../../../src/thought.png') },
];

export default function NewDropProfile({ onClose }) {
  const [addSlidePhotos, setAddSlidePhotos] = useState(true);
  const [activeTab, setActiveTab] = useState('POST');

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: direction === 'left' ? scrollRef.current?.scrollLeft - 150 : scrollRef.current?.scrollLeft + 150,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEW DROP</Text>

      {addSlidePhotos ? (
        <View style={styles.contentContainer}>
          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
              ref={scrollRef}
            >
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.filterItem, activeTab === filter.name && styles.activeFilter]}
                  onPress={() => setActiveTab(filter.name)}
                >
                  <Image source={filter.image} style={styles.filterImage} />
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            <Reel />
          </View>
        </View>
      ) : (
        <ReelNewDrop />
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
  filterContainer: {
    height: 120,
  },
  filterScroll: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  filterItem: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilter: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  filterImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
});
