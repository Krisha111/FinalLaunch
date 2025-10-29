// src/pages/PrivacyPage.jsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PrivacyPage({ onBack }) {
  const navigation = useNavigation();

  // Back button handler
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // Open email link
  const handleMailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Privacy Policy</Text>

          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: "bold" }}>Effective Date: </Text>
            June 17, 2025
          </Text>

          <Text style={styles.paragraph}>
            Thank you for using our social media platform. Your privacy and trust
            are important to us. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit or use our
            app and related services.
          </Text>

          <Text style={styles.heading}>1. Information We Collect</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• <Text style={{ fontWeight: "bold" }}>Personal Information:</Text> Name, username, email address, password (encrypted).</Text>
            <Text style={styles.listItem}>• <Text style={{ fontWeight: "bold" }}>Profile Data:</Text> Profile picture, bio, preferences, links.</Text>
            <Text style={styles.listItem}>• <Text style={{ fontWeight: "bold" }}>Content You Create:</Text> Photos, videos, captions, comments, messages, likes, shares.</Text>
            <Text style={styles.listItem}>• <Text style={{ fontWeight: "bold" }}>Device and Usage Information:</Text> IP address, browser type, device model, OS, interaction logs, crash reports.</Text>
            <Text style={styles.listItem}>• <Text style={{ fontWeight: "bold" }}>Location Data:</Text> If you enable location features, we may collect GPS-based or IP-based location info.</Text>
          </View>

          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>We use your information for purposes such as:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Account creation, authentication, and profile management.</Text>
            <Text style={styles.listItem}>• Enabling social features like posting, commenting, following users, and chatting.</Text>
            <Text style={styles.listItem}>• Recommending content and connections based on your activity.</Text>
            <Text style={styles.listItem}>• Ensuring app safety and moderating content to prevent abuse or harassment.</Text>
            <Text style={styles.listItem}>• Responding to support requests and feedback.</Text>
            <Text style={styles.listItem}>• Improving performance, fixing bugs, and running analytics.</Text>
          </View>

          <Text style={styles.heading}>3. Cookies and Tracking Technologies</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar technologies (such as local storage and analytics tools) to:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Keep you signed in across sessions.</Text>
            <Text style={styles.listItem}>• Analyze app traffic and trends.</Text>
            <Text style={styles.listItem}>• Store preferences and settings.</Text>
          </View>
          <Text style={styles.paragraph}>
            You can control cookies through your browser settings. Disabling cookies may affect some functionality of the app.
          </Text>

          <Text style={styles.heading}>4. Sharing and Disclosure</Text>
          <Text style={styles.paragraph}>
            We do <Text style={{ fontWeight: "bold" }}>not</Text> sell your personal data. We may share information:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• With service providers like cloud storage, content delivery networks, and analytics platforms.</Text>
            <Text style={styles.listItem}>• With law enforcement if legally required to do so or to protect our rights and other users.</Text>
            <Text style={styles.listItem}>• With other users of the app based on your content visibility settings (e.g., public posts, comments).</Text>
          </View>

          <Text style={styles.heading}>5. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We may integrate with third-party tools (like image hosting, social logins, or analytics). These services may collect information according to their own privacy policies. We recommend reviewing their terms and policies before using integrated features.
          </Text>

          <Text style={styles.heading}>6. Content Visibility and User Control</Text>
          <Text style={styles.paragraph}>
            Content you share publicly (such as posts or profile info) may be visible to all users. You can control your privacy settings, delete your posts, or deactivate your account at any time.
          </Text>

          <Text style={styles.heading}>7. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your information for as long as your account is active or as needed to fulfill legal or operational obligations. Upon account deletion, we will remove or anonymize your personal data within a reasonable period.
          </Text>

          <Text style={styles.heading}>8. Children’s Privacy</Text>
          <Text style={styles.paragraph}>
            Our app is not directed to individuals under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has created an account, please contact us so we can delete the data.
          </Text>

          <Text style={styles.heading}>9. Security Measures</Text>
          <Text style={styles.paragraph}>
            We use industry-standard encryption and security practices to protect your data. However, no system is 100% secure. We encourage you to use strong passwords and report any suspicious activity.
          </Text>

          <Text style={styles.heading}>10. Your Rights and Choices</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Access, update, or delete your profile information.</Text>
            <Text style={styles.listItem}>• Deactivate or permanently delete your account.</Text>
            <Text style={styles.listItem}>• Request access to the personal data we store about you.</Text>
            <Text style={styles.listItem}>• Withdraw consent for optional data collection (e.g., analytics or marketing).</Text>
          </View>

          <Text style={styles.heading}>11. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this policy occasionally. If we make significant changes, we’ll notify you via email or in-app alerts. Continued use of the app after changes means you accept the updated policy.
          </Text>

          {/* <Text style={styles.heading}>12. Contact Us</Text>
          <Text style={styles.paragraph}>
            📧{" "}
            <Text style={{ color: "blue" }} onPress={() => handleMailPress("support@yourapp.com")}>
              support@yourapp.com
            </Text>
            {"\n"}🏢 Your Company Name, 123 App Street, City, Country
          </Text> */}

          <View style={{ height: 1, backgroundColor: "#ccc", marginVertical: 20 }} />

          <Text style={{ fontSize: 12, color: "#666" }}>
            This Privacy Policy is subject to change and governed by applicable data protection laws.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  backButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, fontWeight: "700", textAlign: "center", flex: 1, color: "#1a1a1a" },
  headerSpacer: { width: 44, height: 44 },
  container: { padding: 20 },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 6,
  },
  paragraph: { marginBottom: 12, lineHeight: 22, color: "#111" },
  heading: { fontSize: 18, fontWeight: "700", marginTop: 16, marginBottom: 6, color: "#111" },
  list: { marginBottom: 12, paddingLeft: 16 },
  listItem: { lineHeight: 22, marginBottom: 4, color: "#111" },
});
