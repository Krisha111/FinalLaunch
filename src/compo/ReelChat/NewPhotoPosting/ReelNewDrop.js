// src/screens/ReelNewDrop.js
// ✅ Full version — fixes expo-video crash + ImagePicker deprecation warning

import React, { useState, useEffect , useRef} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Video } from "expo-av"; // ✅ using expo-av instead of expo-video
import { setPhotoReelImages } from "../../../Redux/Slice/MakingNewDrop/Reel.js";

const BASE_URL = "https://finallaunchbackend.onrender.com";

export default function ReelNewDrop() {
  const navigation = useNavigation();
  const loggedInUser = useSelector((state) => state.signUpAuth?.user);
  const dispatch = useDispatch();
  const route = useRoute();
  const { poster, postType } = route.params || {};
  const {
    reelScript,
    reelLocation,
    reelCommenting,
    reelLikeCountVisible,
    reelShareCountVisible,
    reelPinned,
  } = useSelector((state) => state.reel);

  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
const videoRef = useRef(null);
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playAsync().catch(() => {});
  }
}, [preview?.uri]);

  useEffect(() => {
    if (preview && preview.uri) {
      dispatch(setPhotoReelImages([preview.uri]));
    } else {
      dispatch(setPhotoReelImages([]));
    }
  }, [preview, dispatch]);

  const ensureMediaPermission = async () => {
    if (Platform.OS === "web") return true;
    const { status } = await
     ImagePicker.getMediaLibraryPermissionsAsync();
    if (status === "granted") return true;
    const { status: req } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (req === "granted") return true;

    Alert.alert(
      "Permission required",
      "Please allow access to your video in Settings to continue.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings && Linking.openSettings(),
        },
      ]
    );
    return false;
  };

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
          mediaTypes: [ImagePicker.MediaType.video], // ✅ fixed deprecated option
          allowsMultipleSelection: false,
          quality: 0.9,
        });

        if (!result || result.canceled) return;
        const asset = result.assets?.[0];
        if (!asset) return;

        const mapped = {
          uri: asset.uri,
          type: asset.type ?? "video/mp4",
          name: asset.fileName ?? asset.uri?.split("/").pop(),
        };
        setVideoFile(mapped);
        setPreview({ uri: mapped.uri, type: mapped.type });
      } catch (err) {
        console.error("selectVideo error:", err);
        setError("Failed to pick a video.");
      }
    }
  };

  // ===== Unified upload: Web vs React Native =====
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
        // --- Web upload ---
        const formData = new FormData();
        formData.append("reelScript", reelScript ?? "");
        formData.append("reelLocation", reelLocation ?? "");
        formData.append("reelCommenting", String(reelCommenting ?? true));
        formData.append("reelLikeCountVisible", String(reelLikeCountVisible ?? ""));
        formData.append("reelShareCountVisible", String(reelShareCountVisible ?? ""));
        formData.append("reelPinned", String(reelPinned ?? ""));
        formData.append("type", postType || "regular");

        formData.append("poster", poster.fileObject);
        formData.append("reelFiles", videoFile.fileObject);

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
          navigation.navigate("ProfileScreen", { userId: loggedInUser._id });
        } else {
          setError(data?.message || `Server error: ${res.status}`);
        }
      } else {
        // --- React Native upload ---
        const uploadUrl = `${BASE_URL}/api/reels/newReelDrop`;

        const uploadResult = await FileSystem.uploadAsync(uploadUrl, videoFile.uri, {
          httpMethod: "POST",
          fieldName: "reelFiles",
          headers: { Authorization: `Bearer ${token}` },
          parameters: {
            reelScript: reelScript ?? "",
            reelLocation: reelLocation ?? "",
            reelCommenting: String(reelCommenting ?? true),
            reelLikeCountVisible: String(reelLikeCountVisible ?? ""),
            reelShareCountVisible: String(reelShareCountVisible ?? ""),
            reelPinned: String(reelPinned ?? ""),
            type: postType || "regular",
          },
        });

        let data = null;
        try {
          data = JSON.parse(uploadResult.body);
        } catch (e) {
          console.warn(e);
        }

        if (uploadResult.status >= 200 && uploadResult.status < 300) {
          if (poster?.uri) {
            await FileSystem.uploadAsync(
              `${BASE_URL}/api/reels/${data.reel._id}/poster`,
              poster.uri,
              {
                httpMethod: "POST",
                fieldName: "poster",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
          navigation.navigate("ProfileScreen", { userId: loggedInUser._id });
        } else {
          setError(data?.message || `Server error: ${uploadResult.status}`);
        }
      }
    } catch (err) {
      console.error("❌ UPLOAD ERROR:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.sliderContainer}>
      
        {preview && preview.uri ? (
          Platform.OS === "web" ? (
            <video
              src={preview.uri}
              controls
              autoPlay
              loop
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
            />
          ) : (
            <Video
  ref={videoRef}                  // <-- Add ref
  source={{ uri: preview.uri }}
  style={styles.media}
  resizeMode="cover"
  isLooping
  useNativeControls                // <-- keep native controls
/>

            // <Video
            //   source={{ uri: preview.uri }}
            //   style={styles.media}
            //   resizeMode="cover"
            //   shouldPlay
            //   isLooping
            //   useNativeControls
            // />
          )
        ) : (
          <Text style={styles.noImageText}>No video uploaded</Text>
        )}
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={selectVideo}>
        <Text style={styles.buttonText}>Select Video</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
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
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  makeContainerSetting: {
    fontWeight: "600",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
  },
  sliderContainer: {
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f6f6f6",
    overflow: "hidden",
  },
  media: { width: "100%", height: "100%", borderRadius: 12 },
  noImageText: { marginBottom: 10, color: "#666" },
  selectButton: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold" },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  bottomButton: {
    flex: 1,
  },
  errorContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#fee",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fcc",
  },
  errorText: {
    color: "#c00",
    fontSize: 13,
    lineHeight: 18,
  },
});
