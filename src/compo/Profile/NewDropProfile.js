// src/components/SubComponents/Profile/NewDropProfile.native.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Keep relative imports to your RN components (assumes RN versions exist)
import Reel from './NewDropOptions/Reel'; // you should have RN version

import { useSelector } from 'react-redux';

import ReelNewDrop from '../ReelChat/NewPhotoPosting/ReelNewDrop';

// Images: require static assets (adjust paths if needed)

const reel = require('../../../assets/images/reel.png');


const { width: DEVICE_WIDTH } = Dimensions.get('window');

export default function NewDropProfile({ onClose }) {
  const [addSlidePhotos, setAddSlidePhotos] = useState(true);

  // filters array preserved
  const filters = [

    { name: 'REEL', image: reel },
   
  ];

  // ref for horizontal ScrollView
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('POST');
  const [scrollX, setScrollX] = useState(0);

 

  // scroll helper - scroll by half screen width
  const scroll = (direction) => {
    const scrollAmount = Math.round(DEVICE_WIDTH / 2);
    const newX = direction === 'left' ? Math.max(scrollX - scrollAmount, 0) : scrollX + scrollAmount;
    if (scrollRef.current && typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({ x: newX, y: 0, animated: true });
      setScrollX(newX);
    }
  };

  // auto-focus equivalent: ensure content is visible on mount
  useEffect(() => {
    // nothing exactly like DOM focus in RN for a scroll container;
    // we can optionally scroll to 0 on mount:
    if (scrollRef.current && typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
      setScrollX(0);
    }
  }, []);

  // render the tab content area (keeps same behavior as original)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'REEL':
        // original web used <Reel/>
        return <Reel />;
      // add other tabs as you implement them:
      // case 'POST':
      // case 'MOMENT':
      // case 'HIGHLIGHT':
      // case 'THOUGHT':
      default:
        // default to Reel to match original's default return
        return <Reel />;
    }
  };

  return (
    <View style={styles.newDropProfileContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.titleRow}>
          {/* <Text style={styles.titleText}>NEW DROP</Text> */}

          {/* Right side: toggle between "choose media" and "add slide photos" */}
          {/* <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setAddSlidePhotos(true)}
              style={[
                styles.toggleButton,
                addSlidePhotos ? styles.toggleButtonActive : null,
              ]}
            >
              <Text style={addSlidePhotos ? styles.toggleTextActive : styles.toggleText}>
                CHOOSE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAddSlidePhotos(false)}
              style={[
                styles.toggleButton,
                !addSlidePhotos ? styles.toggleButtonActive : null,
              ]}
            >
              <Text style={!addSlidePhotos ? styles.toggleTextActive : styles.toggleText}>
                UPLOAD
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {addSlidePhotos ? (
          <>
            <View style={styles.theNewDropContentContainer}>
              <View style={styles.selectingContainer}>
                {/* horizontal filter scroller with left/right chevrons */}
                {/* <View style={styles.filtersRow}>
                  <TouchableOpacity
                    onPress={() => scroll('left')}
                    style={styles.chevronButton}
                    accessibilityLabel="scroll-left"
                  >
                    <FontAwesome name="chevron-left" size={18} />
                  </TouchableOpacity>

                  <ScrollView
                    horizontal
                    ref={scrollRef}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.filtersScrollContent}
                  >
                    {filters.map((f) => (
                      <TouchableOpacity
                        key={f.name}
                        style={[
                          styles.filterItem,
                          activeTab === f.name ? styles.filterItemActive : null,
                        ]}
                        onPress={() => setActiveTab(f.name)}
                      >
                        <Image source={f.image} style={styles.filterImage} />
                        <Text style={styles.filterLabel}>{f.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity
                    onPress={() => scroll('right')}
                    style={styles.chevronButton}
                    accessibilityLabel="scroll-right"
                  >
                    <FontAwesome name="chevron-right" size={18} />
                  </TouchableOpacity>
                </View> */}

                {/* content area (kept original structure) */}
                <View style={styles.newDropTabContentContainer}>
                  {renderTabContent()}
                </View>
              </View>
            </View>
          </>
        ) : (
          // when addSlidePhotos === false => show ReelNewDrop (upload screen)
          <ReelNewDrop />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  newDropProfileContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  innerContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
    backgroundColor: '#f0f0f0',
  },
  toggleButtonActive: {
    backgroundColor: '#333',
  },
  toggleText: {
    fontSize: 12,
    color: '#333',
  },
  toggleTextActive: {
    fontSize: 12,
    color: '#fff',
  },
  theNewDropContentContainer: {
    flex: 1,
  },
  selectingContainer: {
    flex: 1,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chevronButton: {
    padding: 8,
  },
  filtersScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  filterItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 8,
  },
  filterItemActive: {
    backgroundColor: '#e6e6e6',
  },
  filterImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  newDropTabContentContainer: {
    flex: 1,
    // this container will host your Reel component (RN) — style as needed
    paddingVertical: 8,
  },
});
