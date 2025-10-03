// PrivacyPage.js
import React from "react";
import { ScrollView, Text, View, Linking, StyleSheet } from "react-native";

export default function PrivacyPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.date}>Effective Date: June 17, 2025</Text>

      <Text style={styles.paragraph}>
        Thank you for using our social media platform. Your privacy and trust are
        important to us. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit or use our app
        and related services.
      </Text>

      <Text style={styles.heading}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>• Personal Information: Name, username, email address, password (encrypted).</Text>
      <Text style={styles.paragraph}>• Profile Data: Profile picture, bio, preferences, links.</Text>
      <Text style={styles.paragraph}>• Content You Create: Photos, videos, captions, comments, messages, likes, shares.</Text>
      <Text style={styles.paragraph}>• Device and Usage Information: IP address, browser type, device model, OS, interaction logs, crash reports.</Text>
      <Text style={styles.paragraph}>• Location Data: If enabled, GPS-based or IP-based location info.</Text>

      <Text style={styles.heading}>2. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        We use your information for:
      </Text>
      <Text style={styles.paragraph}>• Account creation and authentication.</Text>
      <Text style={styles.paragraph}>• Social features (posting, commenting, following, chatting).</Text>
      <Text style={styles.paragraph}>• Recommending content and connections.</Text>
      <Text style={styles.paragraph}>• Safety, moderation, and preventing abuse.</Text>
      <Text style={styles.paragraph}>• Responding to support requests.</Text>
      <Text style={styles.paragraph}>• Performance improvement and analytics.</Text>

      <Text style={styles.heading}>3. Cookies and Tracking Technologies</Text>
      <Text style={styles.paragraph}>
        We use cookies and similar technologies to keep you signed in, analyze
        traffic, and store preferences. You can control cookies via browser
        settings, but disabling them may affect functionality.
      </Text>

      <Text style={styles.heading}>4. Sharing and Disclosure</Text>
      <Text style={styles.paragraph}>We do NOT sell your personal data. We may share with:</Text>
      <Text style={styles.paragraph}>• Service providers (cloud, CDN, analytics).</Text>
      <Text style={styles.paragraph}>• Law enforcement when legally required.</Text>
      <Text style={styles.paragraph}>• Other users depending on your visibility settings.</Text>

      <Text style={styles.heading}>5. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        We may integrate with external tools (hosting, analytics, social logins).
        Please review their policies separately.
      </Text>

      <Text style={styles.heading}>6. Content Visibility and User Control</Text>
      <Text style={styles.paragraph}>
        Public posts may be visible to all users. You can adjust privacy
        settings, delete posts, or deactivate your account anytime.
      </Text>

      <Text style={styles.heading}>7. Data Retention</Text>
      <Text style={styles.paragraph}>
        We retain your info as long as your account is active. Upon deletion,
        data will be removed or anonymized within a reasonable period.
      </Text>

      <Text style={styles.heading}>8. Children’s Privacy</Text>
      <Text style={styles.paragraph}>
        The app is not for users under 13. If a child registers, contact us to
        remove the account.
      </Text>

      <Text style={styles.heading}>9. Security Measures</Text>
      <Text style={styles.paragraph}>
        We use encryption and industry-standard practices, but no system is 100%
        secure. Use strong passwords and report suspicious activity.
      </Text>

      <Text style={styles.heading}>10. Your Rights and Choices</Text>
      <Text style={styles.paragraph}>• Access, update, or delete profile info.</Text>
      <Text style={styles.paragraph}>• Deactivate or delete account.</Text>
      <Text style={styles.paragraph}>• Request stored data.</Text>
      <Text style={styles.paragraph}>• Withdraw consent for optional data use.</Text>

      <Text style={styles.heading}>11. Changes to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update occasionally. Significant changes will be notified via
        email or in-app alerts.
      </Text>

      <Text style={styles.heading}>12. Contact Us</Text>
      <Text style={styles.paragraph}>
        📧 <Text style={styles.link} onPress={() => Linking.openURL("mailto:support@yourapp.com")}>support@yourapp.com</Text>
      </Text>
      <Text style={styles.paragraph}>🏢 Your Company Name, 123 App Street, City, Country</Text>

      <Text style={styles.footer}>
        This Privacy Policy is subject to change and governed by applicable laws.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: "#000" },
  date: { fontSize: 14, marginBottom: 20, color: "#333" },
  heading: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 8 },
  paragraph: { fontSize: 15, marginBottom: 8, lineHeight: 22, color: "#444" },
  link: { color: "blue", textDecorationLine: "underline" },
  footer: { fontSize: 12, color: "#666", marginTop: 30, textAlign: "center" },
});
