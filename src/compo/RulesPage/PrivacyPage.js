import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', lineHeight: '1.7', fontFamily: 'sans-serif' }}>
      <h1>Privacy Policy</h1>

      <p><strong>Effective Date:</strong> June 17, 2025</p>

      <p>
        Thank you for using our social media platform. Your privacy and trust are important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our app and related services.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Personal Information:</strong> Name, username, email address, password (encrypted).</li>
        <li><strong>Profile Data:</strong> Profile picture, bio, preferences, links.</li>
        <li><strong>Content You Create:</strong> Photos, videos, captions, comments, messages, likes, shares.</li>
        <li><strong>Device and Usage Information:</strong> IP address, browser type, device model, OS, interaction logs, crash reports.</li>
        <li><strong>Location Data:</strong> If you enable location features, we may collect GPS-based or IP-based location info.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information for purposes such as:</p>
      <ul>
        <li>Account creation, authentication, and profile management.</li>
        <li>Enabling social features like posting, commenting, following users, and chatting.</li>
        <li>Recommending content and connections based on your activity.</li>
        <li>Ensuring app safety and moderating content to prevent abuse or harassment.</li>
        <li>Responding to support requests and feedback.</li>
        <li>Improving performance, fixing bugs, and running analytics.</li>
      </ul>

      <h2>3. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies (such as local storage and analytics tools) to:
      </p>
      <ul>
        <li>Keep you signed in across sessions.</li>
        <li>Analyze app traffic and trends.</li>
        <li>Store preferences and settings.</li>
      </ul>
      <p>
        You can control cookies through your browser settings. Disabling cookies may affect some functionality of the app.
      </p>

      <h2>4. Sharing and Disclosure</h2>
      <p>We do <strong>not</strong> sell your personal data. We may share information:</p>
      <ul>
        <li>With service providers like cloud storage, content delivery networks, and analytics platforms.</li>
        <li>With law enforcement if legally required to do so or to protect our rights and other users.</li>
        <li>With other users of the app based on your content visibility settings (e.g., public posts, comments).</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>
        We may integrate with third-party tools (like image hosting, social logins, or analytics). These services may collect information according to their own privacy policies. We recommend reviewing their terms and policies before using integrated features.
      </p>

      <h2>6. Content Visibility and User Control</h2>
      <p>
        Content you share publicly (such as posts or profile info) may be visible to all users. You can control your privacy settings, delete your posts, or deactivate your account at any time.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as needed to fulfill legal or operational obligations. Upon account deletion, we will remove or anonymize your personal data within a reasonable period.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        Our app is not directed to individuals under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has created an account, please contact us so we can delete the data.
      </p>

      <h2>9. Security Measures</h2>
      <p>
        We use industry-standard encryption and security practices to protect your data. However, no system is 100% secure. We encourage you to use strong passwords and report any suspicious activity.
      </p>

      <h2>10. Your Rights and Choices</h2>
      <ul>
        <li>Access, update, or delete your profile information.</li>
        <li>Deactivate or permanently delete your account.</li>
        <li>Request access to the personal data we store about you.</li>
        <li>Withdraw consent for optional data collection (e.g., analytics or marketing).</li>
      </ul>

      <h2>11. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy occasionally. If we make significant changes, we’ll notify you via email or in-app alerts. Continued use of the app after changes means you accept the updated policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        For questions, feedback, or data requests, please reach out to:
      </p>
      <p>
        📧 <a href="mailto:support@yourapp.com">support@yourapp.com</a><br />
        🏢 Your Company Name, 123 App Street, City, Country
      </p>

      <hr />
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        This Privacy Policy is subject to change and governed by applicable data protection laws.
      </p>
    </div>
  );
}
