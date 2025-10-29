// src/pages/TermsOfServicePage.jsx
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

export default function TermsOfServicePage({ onBack }) {
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.effective}>
            <Text style={{ fontWeight: "bold" }}>Effective Date: </Text>
            June 17, 2025
          </Text>

          <Text style={styles.paragraph}>
            Welcome to our social media platform. By accessing or using our app,
            you agree to be bound by these Terms of Service. Please read them
            carefully.
          </Text>

          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By creating an account or using any part of our app, you agree to
            these Terms, our Privacy Policy, and any additional rules or
            policies we post.
          </Text>

          <Text style={styles.heading}>2. Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 13 years old to use our platform. If you are
            under 18, you must have permission from a parent or legal guardian.
          </Text>

          <Text style={styles.heading}>3. Account Responsibilities</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • You are responsible for your account and keeping your password
              secure.
            </Text>
            <Text style={styles.listItem}>
              • All activities that occur under your account are your
              responsibility.
            </Text>
            <Text style={styles.listItem}>
              • We may suspend or terminate accounts that are fake, abusive, or
              violate our policies.
            </Text>
          </View>

          <Text style={styles.heading}>4. User Conduct</Text>
          <Text style={styles.paragraph}>You agree NOT to:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Post or share unlawful, hateful, abusive, harassing, or harmful
              content.
            </Text>
            <Text style={styles.listItem}>
              • Impersonate any person or entity.
            </Text>
            <Text style={styles.listItem}>
              • Violate the privacy of others or publish private information
              without consent.
            </Text>
            <Text style={styles.listItem}>
              • Use the app for spamming, phishing, or distributing malware.
            </Text>
            <Text style={styles.listItem}>
              • Reverse-engineer or tamper with the app or its source code.
            </Text>
          </View>

          <Text style={styles.heading}>5. User-Generated Content</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • You retain ownership of the content you post, but you grant us
              a worldwide, non-exclusive, royalty-free license to use, display,
              and distribute it within the app and for promotional purposes.
            </Text>
            <Text style={styles.listItem}>
              • We do not claim ownership of your media, but we may remove
              content that violates our guidelines.
            </Text>
            <Text style={styles.listItem}>
              • You are solely responsible for the legality and accuracy of the
              content you upload.
            </Text>
          </View>

          <Text style={styles.heading}>6. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The app, logo, design, and all platform content (excluding user
            content) are the property of the company. You may not copy, modify,
            or distribute any part of our services without our permission.
          </Text>

          <Text style={styles.heading}>7. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your access to the app
            at any time, without prior notice, if you violate these Terms or
            engage in harmful behavior.
          </Text>
          <Text style={styles.paragraph}>
            You may delete your account at any time through the settings page.
          </Text>

          <Text style={styles.heading}>8. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            We provide our platform "as is" and "as available." We do not
            guarantee that the app will always be secure, bug-free, or available
            without interruptions. Use at your own risk.
          </Text>

          <Text style={styles.heading}>9. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent allowed by law, we are not liable for any
            indirect, incidental, or consequential damages resulting from your
            use of the platform. This includes data loss, account compromise, or
            exposure to harmful content.
          </Text>

          <Text style={styles.heading}>10. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            Our platform may integrate with third-party services (e.g., media
            storage, analytics). We are not responsible for the terms, policies,
            or practices of these third parties.
          </Text>

          <Text style={styles.heading}>11. Changes to the Terms</Text>
          <Text style={styles.paragraph}>
            We may update these Terms at any time. When we do, we’ll update the
            effective date and notify you via the app or email. Continued use of
            the app means you accept the new Terms.
          </Text>

          <Text style={styles.heading}>12. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms are governed by and construed in accordance with the
            laws of [Your Country/State]. You agree to resolve any disputes
            exclusively in the courts located in [Your Jurisdiction].
          </Text>

          {/* <Text style={styles.heading}>13. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions or concerns about these Terms, please contact
            us at:
          </Text>
          <Text style={styles.paragraph}>
            📧{" "}
            <Text
              style={{ color: "blue" }}
              onPress={() => handleMailPress("support@yourapp.com")}
            >
              support@yourapp.com
            </Text>
            {"\n"}🏢 Your Company Name, 123 App Street, City, Country
          </Text> */}

          <View style={{ height: 1, backgroundColor: "#ccc", marginVertical: 20 }} />

          <Text style={{ fontSize: 12, color: "#666" }}>
            These Terms of Service are subject to change and were last updated on June
            17, 2025.
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
  effective: { marginBottom: 12, color: "#555" },
  paragraph: { marginBottom: 12, lineHeight: 22, color: "#111" },
  heading: { fontSize: 18, fontWeight: "700", marginTop: 16, marginBottom: 6, color: "#111" },
  list: { marginBottom: 12, paddingLeft: 16 },
  listItem: { lineHeight: 22, marginBottom: 4, color: "#111" },
});
