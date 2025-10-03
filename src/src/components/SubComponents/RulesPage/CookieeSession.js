// src/screens/CookiesPolicyPage.js
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";

export default function CookiesPolicyPage() {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cookies Policy</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Effective Date:</Text> June 17, 2025
      </Text>

      <Text style={styles.paragraph}>
        This Cookies Policy explains how and why cookies and similar technologies
        are used when you access or interact with our social media application…
      </Text>

      <Text style={styles.section}>1. What Are Cookies?</Text>
      <Text style={styles.paragraph}>
        Cookies are small data files that websites and apps store on your browser
        or device to remember information about you…
      </Text>

      <Text style={styles.section}>2. Why We Use Cookies</Text>
      <Text style={styles.paragraph}>
        Our application uses cookies to enhance user experience, personalize
        content, and ensure the platform functions smoothly…
      </Text>

      <Text style={styles.section}>3. Types of Cookies We Use</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Essential Cookies:</Text> Critical for basic
          functionalities such as logging in and securing user sessions.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Preference Cookies:</Text> Remember your
          settings such as language, theme, or layout.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Performance and Analytics Cookies:</Text>{" "}
          Help us understand how users interact with the app without identifying
          individuals.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Third-party Cookies:</Text> Set by providers
          like Google Analytics or authentication services.
        </Text>
      </View>

      <Text style={styles.section}>4. How We Use Third-Party Cookies</Text>
      <Text style={styles.paragraph}>
        In some cases, we integrate tools and services provided by trusted third
        parties. These services may place their own cookies on your device…
      </Text>

      <Text style={styles.section}>5. Your Control Over Cookies</Text>
      <Text style={styles.paragraph}>
        You are always in control of your cookie preferences. Most web browsers
        allow you to accept or reject cookies…
      </Text>

      <Text style={styles.section}>6. How to Manage Cookies in Your Browser</Text>
      <View style={styles.list}>
        <TouchableOpacity
          onPress={() =>
            openLink("https://support.google.com/chrome/answer/95647")
          }
        >
          <Text style={styles.link}>• Google Chrome</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            openLink(
              "https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
            )
          }
        >
          <Text style={styles.link}>• Mozilla Firefox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openLink("https://support.apple.com/en-us/HT201265")}
        >
          <Text style={styles.link}>• Apple Safari</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            openLink(
              "https://support.microsoft.com/en-us/topic/turn-cookies-on-or-off-b08b4c2f-57b9-9b3d-63ef-49b1647e3f1f"
            )
          }
        >
          <Text style={styles.link}>• Microsoft Edge</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.section}>7. Future Use of Cookies</Text>
      <Text style={styles.paragraph}>
        As we continue to develop and enhance our platform, we may introduce new
        cookies or update how we use existing ones…
      </Text>

      <Text style={styles.section}>8. Contact Us</Text>
      <Text style={styles.paragraph}>
        📧 support@yourapp.com{"\n"}
        🏢 YourApp Inc., 123 App Street, City, Country
      </Text>

      <View style={styles.separator} />

      <Text style={styles.footer}>
        This Cookies Policy was last updated on June 17, 2025.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 900,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  list: {
    marginLeft: 10,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  link: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 16,
  },
  footer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
});
