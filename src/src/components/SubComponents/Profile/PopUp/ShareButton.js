import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import IndividualShare from './IndividualShare'; // Adjust path as needed
import { Ionicons, FaIcons, MaterialIcons, RiIcons } from '@expo/vector-icons'; // Expo vector icons

const fakeDataShare = [
  { username: 'krisha' },
  { username: 'akshar' },
  { username: 'raju' },
  { username: 'chutki' },
  { username: 'jaggu' },
  { username: 'bheem' },
];

export default function ShareButton() {

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToWhatsApp = () => {
    const message = `Hey! I found this awesome app. You should try it! ${window.location.href}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const shareToSnapchat = () => {
    const message = `Check out this amazing content! ${window.location.href}`;
    Linking.openURL(`https://snapchat.com/share?text=${encodeURIComponent(message)}`);
  };

  const shareToInstagram = () => {
    alert('Instagram sharing is done via app. Copy the link to share.');
    copyLinkToClipboard();
  };

  const shareToTwitter = () => {
    const message = 'Check out this amazing app!';
    Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`);
  };

  const shareToSMS = () => {
    const message = `Hey! I found this awesome app. You should try it! ${window.location.href}`;
    Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
  };

  const shareToMessenger = () => {
    const message = `Check this out: ${window.location.href}`;
    Linking.openURL(`https://www.messenger.com/t/?link=${encodeURIComponent(message)}`);
  };

  const shareToFacebook = () => {
    Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Share To...</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
        />
        <TouchableOpacity>
          <Ionicons name="mic" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Grid of IndividualShare */}
      <ScrollView contentContainerStyle={styles.shareGrid}>
        {fakeDataShare.map((user, index) => (
          <IndividualShare key={index} username={user.username} />
        ))}
      </ScrollView>

      {/* App Share Buttons */}
      <View style={styles.appButtons}>
        <TouchableOpacity style={styles.button} onPress={copyLinkToClipboard}>
          <Ionicons name="link" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToSnapchat}>
          <FaIcons.FaSnapchatGhost size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToInstagram}>
          <RiIcons.RiInstagramFill size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToTwitter}>
          <FaIcons.FaTwitter size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToSMS}>
          <MaterialIcons name="sms" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToMessenger}>
          <MaterialIcons name="messenger-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={shareToFacebook}>
          <FaIcons.FaFacebook size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 30, fontWeight: 'bold', marginVertical: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: { flex: 1, height: 40 },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 10,
  },
  appButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    margin: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
  },
});
