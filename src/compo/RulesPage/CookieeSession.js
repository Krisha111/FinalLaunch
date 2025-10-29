// src/pages/CookiesPolicyPage.jsx
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

export default function CookiesPolicyPage({ onBack }) {
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
          <Text style={styles.headerTitle}>Cookies Policy</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Cookies Policy</Text>

          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: "bold" }}>Effective Date: </Text>
            June 17, 2025
          </Text>

          <Text style={styles.paragraph}>
            This Cookies Policy explains how and why cookies and similar
            technologies are used when you access or interact with our social
            media application. Understanding how cookies function and what role
            they play can help you make informed decisions about your privacy
            and preferences.
          </Text>

          <Text style={styles.heading}>1. What Are Cookies?</Text>
          <Text style={styles.paragraph}>
            Cookies are small data files that websites and apps store on your
            browser or device to remember information about you. They are
            essential tools that enable web platforms to recognize your device,
            improve your experience, and provide functionalities such as
            staying logged in or saving your preferences. Cookies are not
            programs—they cannot carry viruses or install malware. They act as
            memory for the browser, helping the platform tailor its behavior to
            your actions.
          </Text>

          <Text style={styles.heading}>2. Why We Use Cookies</Text>
          <Text style={styles.paragraph}>
            Our application uses cookies to enhance user experience, personalize
            content, and ensure the platform functions smoothly. Without
            cookies, you would be asked to log in every time you open the app,
            and your interactions would not be saved across sessions. Cookies
            also allow us to detect issues, track app performance, and
            understand how different features are used. This enables us to
            improve navigation, fix bugs, and create features that align with
            user needs.
          </Text>

          <Text style={styles.heading}>3. Types of Cookies We Use</Text>
          <Text style={styles.paragraph}>We use a variety of cookies, each serving a specific purpose:</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • <Text style={{ fontWeight: "bold" }}>Essential Cookies:</Text> These are critical for basic functionalities, such as logging in, account verification, and securing user sessions. Without them, you wouldn’t be able to use key features of the app.
            </Text>
            <Text style={styles.listItem}>
              • <Text style={{ fontWeight: "bold" }}>Preference Cookies:</Text> These remember your settings and preferences, such as your language, theme, or layout configuration. They allow the app to customize itself according to your choices each time you visit.
            </Text>
            <Text style={styles.listItem}>
              • <Text style={{ fontWeight: "bold" }}>Performance and Analytics Cookies:</Text> These cookies help us understand how users interact with the platform. They provide aggregated data on page visits, feature use, and error reporting—without identifying individuals. This data is vital for optimizing usability and performance.
            </Text>
            <Text style={styles.listItem}>
              • <Text style={{ fontWeight: "bold" }}>Third-party Cookies:</Text> We may work with external providers (e.g., Google Analytics, authentication services, content hosting) who set their own cookies to deliver specific services. These cookies are subject to the third-party’s own policies, not ours.
            </Text>
          </View>

          <Text style={styles.heading}>4. How We Use Third-Party Cookies</Text>
          <Text style={styles.paragraph}>
            In some cases, we integrate tools and services provided by trusted
            third parties. These services may place their own cookies on your
            device to analyze traffic, handle authentication, or deliver
            content. For example, we may use Google Analytics to better
            understand user behavior in aggregate form or CDN providers to load
            media faster. These third-party cookies are beyond our direct
            control and are governed by the providers' respective privacy
            policies. We encourage you to review their terms if you wish to
            understand how they manage cookie data.
          </Text>

          <Text style={styles.heading}>5. Your Control Over Cookies</Text>
          <Text style={styles.paragraph}>
            You are always in control of your cookie preferences. Most web
            browsers allow you to accept or reject cookies, delete them manually,
            or set rules for different websites. While you can disable cookies
            at any time through your browser settings, doing so may result in
            certain features of the app not working correctly. For example,
            disabling cookies may prevent automatic login or cause your
            preferences to be forgotten after each session.
          </Text>
          <Text style={styles.paragraph}>
            On your first visit, you may also see a cookie banner or pop-up where
            you can choose to accept all cookies, reject non-essential cookies,
            or customize your preferences. Your selections will be stored in
            your browser until you clear them.
          </Text>

          <Text style={styles.heading}>6. How to Manage Cookies in Your Browser</Text>
          <Text style={styles.paragraph}>
            Below are links to cookie management instructions for the most common browsers. You can use them to review, disable, or delete cookies:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Google Chrome: https://support.google.com/chrome/answer/95647
            </Text>
            <Text style={styles.listItem}>
              • Mozilla Firefox: https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences
            </Text>
            <Text style={styles.listItem}>
              • Apple Safari: https://support.apple.com/en-us/HT201265
            </Text>
            <Text style={styles.listItem}>
              • Microsoft Edge: https://support.microsoft.com/en-us/topic/turn-cookies-on-or-off-b08b4c2f-57b9-9b3d-63ef-49b1647e3f1f
            </Text>
          </View>

          <Text style={styles.heading}>7. Future Use of Cookies</Text>
          <Text style={styles.paragraph}>
            As we continue to develop and enhance our platform, we may introduce
            new cookies or update how we use existing ones to deliver improved
            services and personalization. When we do, we will revise this Cookies
            Policy and notify users if required by law. Any significant changes
            to how cookies function or are used will be clearly communicated.
          </Text>

          {/* <Text style={styles.heading}>8. Contact Us</Text>
          <Text style={styles.paragraph}>
            📧{" "}
            <Text style={{ color: "blue" }} onPress={() => handleMailPress("support@yourapp.com")}>
              support@yourapp.com
            </Text>
            {"\n"}🏢 YourApp Inc., 123 App Street, City, Country
          </Text> */}

          <View style={{ height: 1, backgroundColor: "#ccc", marginVertical: 20 }} />

          <Text style={{ fontSize: 12, color: "#666" }}>
            This Cookies Policy was last updated on June 17, 2025.
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
