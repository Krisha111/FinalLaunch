// src/components/ReelCreation.js
// Merged component: Reel form + Video upload in one file

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setReelScript,
  setReelLocation,
  setPhotoReelImages,
} from "../../../Redux/Slice/MakingNewDrop/Reel.js";
import { setaddSlideReels } from "../../../Redux/Slice/MakingNewDrop/AddDrop.js";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Video } from "expo-av";

const BASE_URL = "https://finallaunchbackend.onrender.com"; // replace with your backend IP

export default function ReelCreation() {
  const {
    reelScript,
    reelLocation,
    reelCommenting,
    reelLikeCountVisible,
    reelShareCountVisible,
    reelPinned,
  } = useSelector((state) => state.reel);
  const addSlideReels = useSelector((state) => state.addDrop.addSlideReels);
  const loggedInUser = useSelector((state) => state.signUpAuth?.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [postType, setPostType] = useState("regular");
  const [poster, setPoster] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: Video Upload

 const VIDEO_MEDIA_TYPE = ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Videos : 1;
const IMAGE_MEDIA_TYPE = ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : 0;


  useEffect(() => {
    if (videoRef.current && preview?.uri) {
      videoRef.current.playAsync?.().catch(() => {});
    }
  }, [preview?.uri]);

  // Request media library permission on mount for mobile
  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") return;
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "We need permission to access your photos. You can enable it in Settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Linking.openSettings) Linking.openSettings();
                },
              },
            ]
          );
        }
      } catch (e) {
        console.warn("Permission error", e);
      }
    })();
  }, []);

  // Update Redux when video preview changes
  useEffect(() => {
    if (preview && preview.uri) {
      dispatch(setPhotoReelImages([preview.uri]));
    } else {
      dispatch(setPhotoReelImages([]));
    }
  }, [preview, dispatch]);

  // Helper to ensure permission before picking on mobile
  const ensureMediaPermission = async () => {
    if (Platform.OS === "web") return true;
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status === "granted") return true;

      const { status: req } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (req === "granted") return true;

      Alert.alert(
        "Permission required",
        "Please allow access to your photos from Settings to choose an image.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings && Linking.openSettings(),
          },
        ]
      );
      return false;
    } catch (err) {
      console.warn("Permission check failed", err);
      return false;
    }
  };

  // Select poster (gallery / file picker)
  const selectPoster = async () => {
    try {
      const ok = await ensureMediaPermission();
      if (!ok) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: IMAGE_MEDIA_TYPE,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.9,
      });

      if (result.canceled || result.cancelled) return;

      const asset = result.assets?.[0] ?? null;
      const uri = asset?.uri ?? result.uri;

      if (!uri) {
        Alert.alert("Pick failed", "Could not select the image. Try again.");
        return;
      }

      setPoster({
        uri,
        name: asset?.fileName ?? asset?.uri?.split("/").pop(),
        type: asset?.type ?? "image",
        width: asset?.width,
        height: asset?.height,
        fileObject: asset?.fileObject,
      });
    } catch (err) {
      console.error("selectPoster error", err);
      Alert.alert("Error", "Failed to pick image. Check console for details.");
    }
  };

  // Take photo with camera (mobile)
  const takePhoto = async () => {
    try {
      if (Platform.OS === "web") {
        Alert.alert("Not available", "Camera capture isn't supported on web here.");
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera permission",
          "Camera access is required to take a photo. Open settings to enable it.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings && Linking.openSettings(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: IMAGE_MEDIA_TYPE,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.9,
      });

      if (result.canceled || result.cancelled) return;

      const asset = result.assets?.[0] ?? null;
      const uri = asset?.uri ?? result.uri;

      if (!uri) {
        Alert.alert("Capture failed", "Could not capture image. Try again.");
        return;
      }

      setPoster({
        uri,
        name: asset?.fileName ?? asset?.uri?.split("/").pop(),
        type: asset?.type ?? "image",
        width: asset?.width,
        height: asset?.height,
      });
    } catch (err) {
      console.error("takePhoto error", err);
      Alert.alert("Error", "Failed to take photo. Check console for details.");
    }
  };

  // Remove selected poster
  const removePoster = () => {
    setPoster(null);
  };

  // Select video
  const selectVideo = async () => {
    setError(null);
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const asset = {
          uri: URL.createObjectURL(file),
          type: file.type || "video/mp4",
          name: file.name,
          fileObject: file,
        };
        setVideoFile(asset);
        setPreview({ uri: asset.uri, type: asset.type });
      };
      input.click();
    } else {
      const ok = await ensureMediaPermission();
      if (!ok) return;
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: VIDEO_MEDIA_TYPE,
          allowsMultipleSelection: false,
          quality: 0.9,
        });

        if (!result) return;
        if (result.canceled || result.cancelled) return;

        const asset = result.assets ? result.assets[0] : result;
        if (!asset) return;

        const mapped = {
          uri: asset.uri,
          type: asset.type ?? "video/mp4",
          name: asset.fileName ?? asset.uri?.split("/").pop(),
        };
        setVideoFile(mapped);
        setPreview({ uri: mapped.uri, type: mapped.type });
      } catch (err) {
        console.error("selectVideo (mobile) error:", err);
        setError("Failed to pick a video.");
      }
    }
  };

  // Handle next button (move to video upload step)
  const handleNext = () => {
    if (!poster) {
      Alert.alert("Missing Poster", "Please select a cover photo before proceeding.");
      return;
    }
    if (!reelScript.trim()) {
      Alert.alert("Missing Script", "Please enter a reel script before proceeding.");
      return;
    }
    dispatch(setaddSlideReels(false));
    setCurrentStep(2);
  };

  // Handle back button
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Unified upload: Web vs React Native
  const handleMakeItOfficial = async () => {
    setError(null);

    try {
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("token")
          : await AsyncStorage.getItem("token");

      if (!token) {
        setError("Login required.");
        return;
      }
      if (!poster) {
        setError("Please choose a cover photo.");
        return;
      }
      if (!videoFile) {
        setError("Please choose a video.");
        return;
      }

      setUploading(true);

      if (Platform.OS === "web") {
        // Web upload
        const formData = new FormData();
        formData.append("reelScript", reelScript ?? "");
        formData.append("reelLocation", reelLocation ?? "");
        formData.append("reelCommenting", String(reelCommenting ?? true));
        formData.append("reelLikeCountVisible", String(reelLikeCountVisible ?? ""));
        formData.append("reelShareCountVisible", String(reelShareCountVisible ?? ""));
        formData.append("reelPinned", String(reelPinned ?? ""));
        formData.append("type", postType || "regular");

        if (poster.fileObject) {
          formData.append("poster", poster.fileObject);
        } else {
          const posterBlob = await fetch(poster.uri).then((r) => r.blob());
          formData.append("poster", posterBlob, poster.name);
        }

        if (videoFile.fileObject) {
          formData.append("reelFiles", videoFile.fileObject);
        } else {
          const videoBlob = await fetch(videoFile.uri).then((r) => r.blob());
          formData.append("reelFiles", videoBlob, videoFile.name);
        }

        const res = await fetch(`${BASE_URL}/api/reels/newReelDrop`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          console.warn(e);
        }

        if (res.ok) {
          Alert.alert("Success", "Reel uploaded successfully!");
          navigation.navigate("ProfileScreen", { userId: loggedInUser._id });
        } else {
          setError(data?.message || `Server error: ${res.status}`);
        }
      } else {
        // React Native upload
        const formData = new FormData();
        formData.append("reelScript", reelScript ?? "");
        formData.append("reelLocation", reelLocation ?? "");
        formData.append("reelCommenting", String(reelCommenting ?? true));
        formData.append("reelLikeCountVisible", String(reelLikeCountVisible ?? ""));
        formData.append("reelShareCountVisible", String(reelShareCountVisible ?? ""));
        formData.append("reelPinned", String(reelPinned ?? ""));
        formData.append("type", postType || "regular");

        if (poster?.uri) {
          const posterFilename = poster.name || poster.uri.split("/").pop();
          const posterMatch = /\.(\w+)$/.exec(posterFilename);
          const posterType = posterMatch ? `image/${posterMatch[1]}` : "image/jpeg";

          formData.append("poster", {
            uri: poster.uri,
            type: posterType,
            name: posterFilename,
          });
        }

        if (videoFile?.uri) {
          const videoFilename = videoFile.name || videoFile.uri.split("/").pop();
          const videoMatch = /\.(\w+)$/.exec(videoFilename);
          const videoType = videoMatch ? `video/${videoMatch[1]}` : "video/mp4";

          formData.append("reelFiles", {
            uri: videoFile.uri,
            type: videoType,
            name: videoFilename,
          });
        }

        const res = await fetch(`${BASE_URL}/api/reels/newReelDrop`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          console.warn("Parse error:", e);
        }

        if (res.ok) {
          Alert.alert("Success", "Reel uploaded successfully!");
          navigation.navigate("ProfileScreen", { userId: loggedInUser._id });
        } else {
          setError(data?.message || `Server error: ${res.status}`);
        }
      }
    } catch (err) {
      console.error("❌ UPLOAD ERROR:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Render Step 1: Form
  const renderFormStep = () => (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Reel Script */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reel Script</Text>
          <TextInput
            style={styles.input}
            value={reelScript}
            placeholder="Write your reel script..."
            placeholderTextColor="#888"
            onChangeText={(text) => dispatch(setReelScript(text))}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Location */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={reelLocation}
            placeholderTextColor="#888"
            placeholder="Enter location..."
            onChangeText={(text) => dispatch(setReelLocation(text))}
          />
        </View>

        {/* Poster Upload */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cover Photo (Poster)</Text>

          <View style={styles.posterButtonsRow}>
            <TouchableOpacity style={styles.posterButton} onPress={selectPoster}>
              <Text style={styles.posterButtonText}>Select Poster</Text>
            </TouchableOpacity>

            {Platform.OS !== "web" && (
              <TouchableOpacity
                style={[styles.posterButton, { marginLeft: 10 }]}
                onPress={takePhoto}
              >
                <Text style={styles.posterButtonText}>Take Photo</Text>
              </TouchableOpacity>
            )}

            {poster && (
              <TouchableOpacity
                style={[styles.removeButton, { marginLeft: 10 }]}
                onPress={removePoster}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {poster && <Image source={{ uri: poster.uri }} style={styles.posterPreview} />}
        </View>

        {/* NEXT Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Render Step 2: Video Upload
  const renderVideoStep = () => (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        {preview && preview.uri ? (
          Platform.OS === "web" ? (
            <video src={preview.uri} controls style={styles.media} />
          ) : (
            <Video
              ref={videoRef}
              key={preview.uri} // force re-render
              source={{ uri: preview.uri }}
              style={styles.media}
              resizeMode="cover"
              isLooping
              useNativeControls
            />
          )
        ) : (
          <Text style={styles.noImageText}>No video uploaded</Text>
        )}
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={selectVideo}>
        <Text style={styles.buttonText}>Select Video</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMakeItOfficial}
          style={[styles.bottomButton, { opacity: uploading ? 0.6 : 1 }]}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.makeContainerSetting}>MAKE IT OFFICIAL</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  return currentStep === 1 ? renderFormStep() : renderVideoStep();
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  inputContainer: { marginBottom: 16 },
  label: { fontWeight: "600", fontSize: 14, color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  posterButtonsRow: { flexDirection: "row", marginTop: 6, alignItems: "center", flexWrap: "wrap" },
  posterButton: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: "#63e25e", borderRadius: 8, alignItems: "center" },
  posterButtonText: { color: "#fff", fontWeight: "600" },
  removeButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "transparent", borderRadius: 8, borderWidth: 1, borderColor: "#d9534f" },
  removeButtonText: { color: "#d9534f", fontWeight: "600" },
  posterPreview: { width: 150, height: 150, borderRadius: 12, marginTop: 10, resizeMode: "cover" },
  bottomButtonContainer: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20, marginBottom: 20 },
  nextButton: { backgroundColor: "#63e25e", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  nextButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  sliderContainer: { width: "100%", height: 350, justifyContent: "center", alignItems: "center", borderRadius: 12, backgroundColor: "#f6f6f6", overflow: "hidden", marginBottom: 10 },
  media: { width: "100%", height: "100%", borderRadius: 12 },
  noImageText: { marginBottom: 10, color: "#666", fontSize: 14 },
  selectButton: { marginVertical: 10, padding: 12, backgroundColor: "#63e25e", borderRadius: 8, alignItems: "center" },
  buttonText: { fontWeight: "600", color: "#fff", fontSize: 14 },
  bottomContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 10 },
  backButton: { flex: 1, backgroundColor: "#ddd", paddingVertical: 15, borderRadius: 8, alignItems: "center" },
  backButtonText: { fontWeight: "600", fontSize: 16, color: "#333" },
  bottomButton: { flex: 1 },
  makeContainerSetting: { fontWeight: "600", padding: 15, borderRadius: 8, backgroundColor: "#63e25e", color: "white", textAlign: "center", fontSize: 16 },
  errorContainer: { marginTop: 15, padding: 15, backgroundColor: "#fee", borderRadius: 8, borderWidth: 1, borderColor: "#fcc" },
  errorText: { color: "#c00", fontSize: 13, lineHeight: 18 },
});
