// src/screens/EditProfile.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import { clearOutput } from "../Redux/Slice/Profile/BackgroundSlice.js";
import { logout } from "../Redux/Slice/Authentication/SignUp.js";
import {
  updateProfile,
  setProfileName,
  setProfileBio,
  setProfileImage,
  fetchProfileById,
} from "../Redux/Slice/Profile/ProfileInformationSlice.js";

import AddDrop from "../compo/Profile/NewDropPopUp/AddDrop.js";

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loggedInUser = useSelector((state) => state.signUpAuth?.user);
  const username = loggedInUser?.username ?? "";

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

  // Load user profile
  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(fetchProfileById(loggedInUser._id));
    }
  }, [dispatch, loggedInUser?._id]);

  // Populate fields on profile update
  useEffect(() => {
    if (profile) {
      dispatch(setProfileName(profile.name || ""));
      dispatch(setProfileBio(profile.bio || ""));
      setProcessedImage(profile.profileImage || null);
      dispatch(setProfileImage(profile.profileImage || null));
    }
  }, [profile, dispatch]);

  // Request gallery permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "We need permission to access your photos."
          );
        }
      } catch (e) {
        console.warn("Permission error", e);
      }
    })();
  }, []);

  // Pick image locally
  const handleFileChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          Platform.OS === "web"
            ? ["Images"]
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) return setDisplayError("Could not pick image");

      setProcessedImage(asset.uri);
      dispatch(setProfileImage(asset.uri));
      dispatch(clearOutput());
      setDisplayError(null);
    } catch (err) {
      console.error(err);
      setDisplayError("Failed to pick image");
    }
  };

  // Save profile
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
      const errorMsg =
        typeof err === "string"
          ? err
          : err?.message || "Failed to save profile. Please try again later.";
      setDisplayError(errorMsg);
      setTimeout(() => setDisplayError(null), 4000);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollInner}>
        <View style={styles.previewImageSettings}>
          <View style={styles.previewImageSettingsError}>
            {displayError && <Text style={styles.error}>{displayError}</Text>}

            {processedImage ? (
              <Image
                source={{ uri: processedImage }}
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.previewImage}>
                <Text style={styles.noImageText}>Preview Image</Text>
              </View>
            )}
          </View>

          <View style={styles.labelSetting}>
            <Text style={styles.label}>PROFILE PHOTO</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.greenButton}
                onPress={handleFileChange}
              >
                <Text style={styles.buttonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            value={profileName}
            onChangeText={(text) => dispatch(setProfileName(text))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>BIO</Text>
          <TextInput
            style={styles.input}
            value={profileBio}
            onChangeText={(text) => dispatch(setProfileBio(text))}
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.greenButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.buttonText}>MAKE IT OFFICIAL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.greenButton, { marginLeft: 10 }]}
            onPress={() => navigation.navigate("AddDrop")}
          >
            <Text style={styles.buttonText}>NEW DROP</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {username ? (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                dispatch(logout());
                navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
              }}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.error}>Not logged in</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollInner: { paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: { marginBottom: 15 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    width: "80%",
  },
  greenButton: { backgroundColor: "#4caf50", padding: 10, borderRadius: 15 },
  logoutButton: {
    backgroundColor: "rgb(244, 52, 52)",
    padding: 10,
    borderRadius: 15,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  previewImage: {
    marginTop: 20,
    width: 350,
    height: 350,
    resizeMode: "contain",
    borderWidth: 4,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#777",
    fontSize: 16,
    fontWeight: "600",
  },
  error: { color: "red", marginTop: 10, fontWeight: "bold" },
  previewImageSettings: {
    
    display: "flex",
    flexDirection: "row",
    paddingBottom: 10,
  },
  previewImageSettingsError: {
    display: "flex",
    flexDirection: "column",
  },
  labelSetting: {
   
    padding: 20,
  },
});
