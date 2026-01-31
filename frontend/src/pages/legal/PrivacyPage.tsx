import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-primary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <Link to="/signup" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft size={16} />
          Back to Signup
        </Link>

        <h1 className="text-3xl font-bold text-primary-900 mb-2">Privacy Policy</h1>
        <p className="text-primary-500 mb-8">Last updated: January 31, 2026</p>

        <div className="prose prose-primary max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">1. Introduction</h2>
            <p className="text-primary-700 leading-relaxed">
              At RentFlow, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read this 
              policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">2. Information We Collect</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Account credentials</li>
              <li>Business information (for vendors): company name, GSTIN, business category</li>
              <li>Payment and billing information</li>
              <li>Transaction history and rental records</li>
              <li>Communications with us and other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">3. Automatically Collected Information</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              When you access our platform, we automatically collect certain information:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and location data</li>
              <li>Usage data (pages visited, time spent, actions taken)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">4. How We Use Your Information</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent activities</li>
              <li>Personalize your experience on the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">5. Information Sharing</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>With vendors or customers to facilitate rental transactions</li>
              <li>With service providers who assist in our operations</li>
              <li>In response to legal process or government requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">6. Data Security</h2>
            <p className="text-primary-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the Internet is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">7. Your Rights</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">8. Cookies</h2>
            <p className="text-primary-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
              and deliver personalized content. You can control cookie preferences through your browser 
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">9. Third-Party Links</h2>
            <p className="text-primary-700 leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites. We encourage you to read the privacy policies 
              of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">10. Children's Privacy</h2>
            <p className="text-primary-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly 
              collect personal information from children. If we learn that we have collected information 
              from a child, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">11. Changes to This Policy</h2>
            <p className="text-primary-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">12. Contact Us</h2>
            <p className="text-primary-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-primary-700 mt-2">
              Email: <a href="mailto:privacy@rentflow.com" className="text-primary-900 hover:underline">privacy@rentflow.com</a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-200">
          <Link 
            to="/signup" 
            className="btn btn-primary"
          >
            Back to Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
