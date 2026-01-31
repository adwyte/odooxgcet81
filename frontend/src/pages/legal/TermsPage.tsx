import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-primary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <Link to="/signup" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft size={16} />
          Back to Signup
        </Link>

        <h1 className="text-3xl font-bold text-primary-900 mb-2">Terms of Service</h1>
        <p className="text-primary-500 mb-8">Last updated: January 31, 2026</p>

        <div className="prose prose-primary max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-primary-700 leading-relaxed">
              By accessing or using RentPe's services, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our platform. These terms apply to all 
              users of the platform, including customers and vendors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">2. Description of Service</h2>
            <p className="text-primary-700 leading-relaxed">
              RentPe is an online marketplace that connects equipment vendors with customers seeking to 
              rent equipment. We facilitate transactions between vendors and customers but are not a party 
              to any rental agreement between them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">3. User Accounts</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              To use certain features of our platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Be responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">4. User Conduct</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the platform for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">5. Rental Transactions</h2>
            <p className="text-primary-700 leading-relaxed">
              All rental transactions are between the vendor and the customer. RentPe acts solely as an 
              intermediary platform. Users are responsible for ensuring they comply with all applicable laws 
              and regulations regarding equipment rental in their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">6. Payments and Fees</h2>
            <p className="text-primary-700 leading-relaxed">
              RentPe may charge service fees for facilitating transactions. All fees will be clearly 
              disclosed before any transaction is completed. Payment processing is handled by secure 
              third-party payment providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-primary-700 leading-relaxed">
              RentPe is not liable for any damages arising from your use of the platform, including but 
              not limited to direct, indirect, incidental, punitive, and consequential damages. We do not 
              guarantee the quality, safety, or legality of items listed on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">8. Intellectual Property</h2>
            <p className="text-primary-700 leading-relaxed">
              All content on the RentPe platform, including logos, text, graphics, and software, is the 
              property of RentPe or its licensors and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">9. Termination</h2>
            <p className="text-primary-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for any reason, 
              including violation of these terms. Upon termination, your right to use the platform 
              will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">10. Changes to Terms</h2>
            <p className="text-primary-700 leading-relaxed">
              We may modify these terms at any time. We will notify users of significant changes via 
              email or through the platform. Your continued use of the platform after changes constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">11. Contact Information</h2>
            <p className="text-primary-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-primary-700 mt-2">
              Email: <a href="mailto:legal@RentPe.com" className="text-primary-900 hover:underline">legal@RentPe.com</a>
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
