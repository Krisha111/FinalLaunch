// ReelNewDrop.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import Video from "react-native-video";
import axios from "axios";
import { setPhotoReelImages } from "../../../../Redux/MakingNewDrop/Reel.js";
import { setaddSlideReels } from "../../../../Redux/MakingNewDrop/AddDrop.js";

export default function ReelNewDrop({ postType, poster, navigation }) {
  const loggedInUser = useSelector((state) => state.signInAuth?.user);
  const dispatch = useDispatch();

  const {
    reelScript,
    reelLocation,
    reelCommenting,
    reelLikeCountVisible,
    reelShareCountVisible,
    reelPinned,
  } = useSelector((state) => state.reel);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const selectMedia = () => {
    launchImageLibrary(
      {
        mediaType: "mixed", // images + videos
        selectionLimit: 0, // multiple
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          setError(response.errorMessage || "Error selecting media");
          return;
        }
        const assets = response.assets || [];
        setMediaFiles((prev) => [...prev, ...assets]);
        setPreviews((prev) => [...prev, ...assets]);
        dispatch(setPhotoReelImages([...previews.map(p => p.uri), ...assets.map(p => p.uri)]));
      }
    );
  };

  const prevSlide = () => setIndex((i) => (i === 0 ? Math.max(previews.length - 1, 0) : i - 1));
  const nextSlide = () => setIndex((i) => (previews.length === 0 ? 0 : (i + 1) % previews.length));

  const handleMakeItOfficial = async () => {
    setError(null);
    const token = await localStorage.getItem("token");
    if (!token) return setError("Login required.");
    if (!poster) return setError("Please choose a cover photo.");
    if (!mediaFiles.length) return setError("Please choose at least one image or video.");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("reelScript", reelScript);
      formData.append("reelLocation", reelLocation);
      formData.append("reelCommenting", reelCommenting);
      formData.append("reelLikeCountVisible", reelLikeCountVisible);
      formData.append("reelShareCountVisible", reelShareCountVisible);
      formData.append("reelPinned", reelPinned);
      formData.append("type", postType || "regular");
      formData.append("poster", poster);

      mediaFiles.forEach((file) => {
        formData.append("reelFiles", {
          uri: file.uri,
          type: file.type,
          name: file.fileName || "file",
        });
      });

      const response = await axios.post("http://localhost:8000/api/reels/newReelDrop", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        navigation.navigate(loggedInUser ? `Profile/${loggedInUser._id}` : "SignIn");
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        {previews.length > 0 ? (
          <>
            {previews[index]?.type?.startsWith("video") ? (
              <Video
                source={{ uri: previews[index].uri }}
                style={styles.media}
                controls
                resizeMode="cover"
              />
            ) : (
              <Image source={{ uri: previews[index].uri }} style={styles.media} />
            )}
            {previews.length > 1 && (
              <>
                <TouchableOpacity style={[styles.sliderButton, { left: 10 }]} onPress={prevSlide}>
                  <Text style={styles.sliderButtonText}>❮</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sliderButton, { right: 10 }]} onPress={nextSlide}>
                  <Text style={styles.sliderButtonText}>❯</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          <Text style={styles.noImageText}>No images/videos uploaded</Text>
        )}
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={selectMedia}>
        <Text style={styles.buttonText}>Select Media</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => dispatch(setaddSlideReels(true))} style={styles.bottomButton}>
          <Text>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMakeItOfficial} style={[styles.bottomButton, { opacity: uploading ? 0.6 : 1 }]}>
          {uploading ? <ActivityIndicator /> : <Text>MAKE IT OFFICIAL</Text>}
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  sliderContainer: { width: "100%", height: 350, justifyContent: "center", alignItems: "center", borderRadius: 12 },
  media: { width: "100%", height: "100%", borderRadius: 12 },
  sliderButton: { position: "absolute", top: "50%", transform: [{ translateY: -12 }], backgroundColor: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 50 },
  sliderButtonText: { color: "#fff", fontSize: 24 },
  noImageText: { marginBottom: 10 },
  selectButton: { marginVertical: 10, padding: 10, backgroundColor: "#ddd", borderRadius: 6, alignItems: "center" },
  buttonText: { fontWeight: "bold" },
  bottomContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  bottomButton: { padding: 10, backgroundColor: "#eee", borderRadius: 6 },
});
