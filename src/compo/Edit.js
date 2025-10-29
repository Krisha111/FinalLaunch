// ✅ src/screens/EditProfile.js — COMPLETE FINAL VERSION WITH HTTPS FIX
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  Linking,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Import logout action from signUpAuthSlice
import { logout } from "../Redux/Slice/Authentication/SignUp.js";
import * as SecureStore from "expo-secure-store";
// ✅ Import from other slices
import { clearOutput } from "../Redux/Slice/Profile/BackgroundSlice.js";
import {
  updateProfile,
  setProfileName,
  setProfileBio,
  setProfileImage,
  fetchProfileById,
} from "../Redux/Slice/Profile/ProfileInformationSlice.js";

// ✅ ADDED: Helper to force HTTPS
const getSecureUrl = (uri) => {
  if (!uri) return null;
  return uri.replace(/^http:/, 'https:');
};

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // ✅ Get user from signUpAuth slice
  const loggedInUser = useSelector((state) => state.signUpAuth?.user);
  const username = loggedInUser?.username ?? "";
  const { user, token } = useSelector((state) => state.signUpAuth);

  // ✅ Get profile data from profileInformation slice
  const profile = useSelector((state) => state.profileInformation?.profile);
  const profileName = useSelector(
    (state) => state.profileInformation?.profileName ?? ""
  );
  const profileBio = useSelector(
    (state) => state.profileInformation?.profileBio ?? ""
  );
  const profileImage = useSelector(
    (state) => state.profileInformation?.profileImage ?? ""
  );

  const [processedImage, setProcessedImage] = useState(null);
  const [displayError, setDisplayError] = useState(null);

  const { width: deviceWidth } = useWindowDimensions();
  const previewSize = Math.min(deviceWidth - 80, 200);

  // ✅ Load profile by ID
  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(fetchProfileById(loggedInUser._id));
    }
  }, [dispatch, loggedInUser?._id]);

  // ✅ Sync local states with HTTPS fix
  useEffect(() => {
    if (profile) {
      dispatch(setProfileName(profile.name || ""));
      dispatch(setProfileBio(profile.bio || ""));
      
      // ✅ FIXED: Force HTTPS when loading existing image
      const secureImageUrl = getSecureUrl(profile.profileImage);
      setProcessedImage(secureImageUrl || null);
      dispatch(setProfileImage(secureImageUrl || null));
    }
  }, [profile, dispatch]);

  // ✅ Request permission
  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") return;
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.warn("Gallery permission not granted");
      }
    })();
  }, []);

  // ✅ Handle file selection from gallery
  const handleFileChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images || ImagePicker.MediaType?.IMAGE,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setProcessedImage(uri);
      dispatch(setProfileImage(uri));
      dispatch(clearOutput());
    }
  };

  // ✅ Handle taking photo with camera
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.warn("Camera permission not granted");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images || ImagePicker.MediaType?.IMAGE,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setProcessedImage(uri);
      dispatch(setProfileImage(uri));
      dispatch(clearOutput());
    }
  };

  // ✅ Handle removing photo
  const handleRemovePhoto = () => {
    setProcessedImage(null);
    dispatch(setProfileImage(null));
    dispatch(clearOutput());
  };

  // ✅ Handle saving profile changes
  const handleSaveChanges = async () => {
    if (!username) return;
    try {
      await dispatch(
        updateProfile({
          username,
          updates: { name: profileName, bio: profileBio, profileImage },
        })
      ).unwrap();

      dispatch(clearOutput());
      navigation.navigate("ProfileScreen", { username });
    } catch (err) {
      setDisplayError(err?.message || "Failed to save profile");
    }
  };

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        // 🧹 Clear browser storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
      } else {
        // 🧹 Clear mobile SecureStore + AsyncStorage
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      }

      // 🧠 Clear Redux state
      dispatch(logout());

      // 🔁 Reset navigation
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "SignUp" }],
        });
      }, 100);
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionLabel}>Profile Photo</Text>
          <View style={styles.photoContainer}>
            <View
              style={[styles.avatarWrapper, 
                { width: previewSize, height: previewSize }]}
            >
              {processedImage ? (
                <Image 
                  source={{ uri: processedImage }}
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {profileName
                      ? profileName.charAt(0).toUpperCase()
                      : username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              {processedImage && (
                <TouchableOpacity
                  style={styles.removeIconButton}
                  onPress={handleRemovePhoto}
                >
                  <Text style={styles.removeIcon}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoButton} onPress={handleFileChange}>
                <MaterialCommunityIcons name="camera" size={22} color="#495057" />
                <Text style={styles.photoButtonText}>Choose Photo</Text>
              </TouchableOpacity>

              {Platform.OS !== "web" && (
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={22}
                    color="#495057"
                  />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Display Name Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Display Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={profileName}
              onChangeText={(t) => dispatch(setProfileName(t))}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Bio</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profileBio}
              onChangeText={(t) => dispatch(setProfileBio(t))}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Display Error */}
        {displayError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{displayError}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges}>
            <Text style={styles.primaryButtonText}>Make It Official</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("AddDrop")}
          >
            <Text style={styles.secondaryButtonText}>Create New Drop</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneLabel}>Account Actions</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#dc3545" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Info (Development Only) */}
        {/* {__DEV__ && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>Username: {username}</Text>
            <Text style={styles.debugText}>User ID: {user?._id || "N/A"}</Text>
            <Text style={styles.debugText}>
              Token: {token ? "Present" : "Missing"}
            </Text>
          </View>
        )} */}
      </ScrollView>
    </View>
  );
}

// ✅ Complete Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollInner: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },

  // Photo Section
  photoSection: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  photoContainer: { alignItems: "center" },
  avatarWrapper: {
    borderRadius: 100,
    backgroundColor: "#fff",
    marginBottom: 24,
    position: "relative",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 100 },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#8ce474ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: { fontSize: 64, fontWeight: "700", color: "#fff" },
  removeIconButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: { fontSize: 24, color: "#fff", fontWeight: "700" },
  photoActions: { flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  photoButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#e1e4e8",
  },
  photoButtonText: { fontSize: 15, fontWeight: "600", color: "#495057" },

  // Input Section
  inputSection: { marginBottom: 24 },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e1e4e8",
  },
  input: { paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: "#1a1a1a" },
  bioInput: { minHeight: 100 },

  // Error Styles
  errorContainer: { backgroundColor: "#fff3cd", borderRadius: 8, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#dc3545" },
  errorText: { color: "#dc3545", fontSize: 14, fontWeight: "500" },

  // Action Buttons
  actionSection: { marginTop: 16, marginBottom: 32, gap: 12 },
  primaryButton: { backgroundColor: "#8ce474ff", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: { backgroundColor: "#fff", paddingVertical: 16, borderRadius: 12, alignItems: "center", borderWidth: 2, borderColor: "#8ce474ff" },
  secondaryButtonText: { color: "#8ce474ff", fontSize: 16, fontWeight: "700" },

  // Danger Zone
  dangerZone: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: "#e1e4e8" },
  dangerZoneLabel: { fontSize: 14, fontWeight: "600", color: "#dc3545", marginBottom: 16 },
  logoutButton: { backgroundColor: "#fff", paddingVertical: 14, borderRadius: 12, alignItems: "center", borderWidth: 2, borderColor: "#dc3545", flexDirection: "row", justifyContent: "center", gap: 8 },
  logoutButtonText: { color: "#dc3545", fontSize: 16, fontWeight: "600" },

  // Debug Section
  debugSection: { marginTop: 32, padding: 16, backgroundColor: "#f0f0f0", borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  debugTitle: { fontSize: 14, fontWeight: "700", color: "#333", marginBottom: 8 },
  debugText: { fontSize: 12, color: "#666", marginBottom: 4, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
});