// TermsOfServicePage.js
import React from "react";
import { ScrollView, Text, Linking, StyleSheet } from "react-native";

export default function TermsOfServicePage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.date}>Effective Date: June 17, 2025</Text>

      <Text style={styles.paragraph}>
        Welcome to our social media platform. By accessing or using our app, you
        agree to be bound by these Terms of Service. Please read them carefully.
      </Text>

      <Text style={styles.heading}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By creating an account or using any part of our app, you agree to these
        Terms, our Privacy Policy, and any additional rules or policies we post.
      </Text>

      <Text style={styles.heading}>2. Eligibility</Text>
      <Text style={styles.paragraph}>
        You must be at least 13 years old to use our platform. If you are under
        18, you must have permission from a parent or legal guardian.
      </Text>

      <Text style={styles.heading}>3. Account Responsibilities</Text>
      <Text style={styles.paragraph}>• You are responsible for your account and keeping your password secure.</Text>
      <Text style={styles.paragraph}>• All activities under your account are your responsibility.</Text>
      <Text style={styles.paragraph}>• We may suspend or terminate accounts that are fake, abusive, or violate policies.</Text>

      <Text style={styles.heading}>4. User Conduct</Text>
      <Text style={styles.paragraph}>You agree NOT to:</Text>
      <Text style={styles.paragraph}>• Post unlawful, hateful, abusive, or harmful content.</Text>
      <Text style={styles.paragraph}>• Impersonate any person or entity.</Text>
      <Text style={styles.paragraph}>• Violate the privacy of others without consent.</Text>
      <Text style={styles.paragraph}>• Use the app for spamming, phishing, or distributing malware.</Text>
      <Text style={styles.paragraph}>• Reverse-engineer or tamper with the app or source code.</Text>

      <Text style={styles.heading}>5. User-Generated Content</Text>
      <Text style={styles.paragraph}>
        • You retain ownership of the content you post, but grant us a worldwide,
        royalty-free license to use, display, and distribute it within the app
        and for promotional purposes.
      </Text>
      <Text style={styles.paragraph}>
        • We may remove content that violates our guidelines.
      </Text>
      <Text style={styles.paragraph}>
        • You are solely responsible for the legality and accuracy of your uploads.
      </Text>

      <Text style={styles.heading}>6. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        The app, logo, design, and all platform content (excluding user content)
        belong to the company. You may not copy, modify, or distribute them
        without permission.
      </Text>

      <Text style={styles.heading}>7. Termination</Text>
      <Text style={styles.paragraph}>
        We may suspend or terminate your access without notice if you violate
        these Terms. You may delete your account anytime via settings.
      </Text>

      <Text style={styles.heading}>8. Disclaimer of Warranties</Text>
      <Text style={styles.paragraph}>
        Our platform is provided "as is" and "as available." We do not guarantee
        it will always be secure, bug-free, or uninterrupted. Use at your own risk.
      </Text>

      <Text style={styles.heading}>9. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        To the maximum extent allowed by law, we are not liable for indirect,
        incidental, or consequential damages, including data loss, account
        compromise, or harmful content exposure.
      </Text>

      <Text style={styles.heading}>10. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        Our platform may integrate with third-party services (e.g., storage,
        analytics). We are not responsible for their terms or policies.
      </Text>

      <Text style={styles.heading}>11. Changes to the Terms</Text>
      <Text style={styles.paragraph}>
        We may update Terms at any time. The effective date will be updated, and
        you’ll be notified via app or email. Continued use means acceptance.
      </Text>

      <Text style={styles.heading}>12. Governing Law</Text>
      <Text style={styles.paragraph}>
        These Terms are governed by the laws of [Your Country/State]. Disputes
        will be resolved exclusively in courts located in [Your Jurisdiction].
      </Text>

      <Text style={styles.heading}>13. Contact Us</Text>
      <Text style={styles.paragraph}>
        📧{" "}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("mailto:support@yourapp.com")}
        >
          support@yourapp.com
        </Text>
      </Text>
      <Text style={styles.paragraph}>
        🏢 Your Company Name, 123 App Street, City, Country
      </Text>

      <Text style={styles.footer}>
        These Terms of Service are subject to change and were last updated on
        June 17, 2025.
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
