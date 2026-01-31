import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function VendorAgreementPage() {
  return (
    <div className="min-h-screen bg-primary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <Link to="/signup/vendor" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900 mb-6">
          <ArrowLeft size={16} />
          Back to Vendor Signup
        </Link>

        <h1 className="text-3xl font-bold text-primary-900 mb-2">Vendor Agreement</h1>
        <p className="text-primary-500 mb-8">Last updated: January 31, 2026</p>

        <div className="prose prose-primary max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">1. Vendor Eligibility</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              To become a vendor on RentFlow, you must:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal right to rent the equipment you list</li>
              <li>Provide accurate business information, including valid GSTIN (if applicable)</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain appropriate insurance coverage for your rental equipment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">2. Listing Requirements</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              As a vendor, you agree to:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Provide accurate and complete descriptions of your equipment</li>
              <li>Upload clear, genuine photos of the actual items</li>
              <li>Set fair and competitive rental prices</li>
              <li>Keep your inventory and availability information up to date</li>
              <li>Only list equipment that is safe, functional, and legally rentable</li>
              <li>Disclose any known defects or limitations of your equipment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">3. Rental Obligations</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              When a customer rents your equipment, you agree to:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Confirm or reject rental requests within 24 hours</li>
              <li>Provide equipment in the condition described in the listing</li>
              <li>Include all necessary accessories and documentation</li>
              <li>Be available for equipment handover at the agreed time</li>
              <li>Provide basic instructions for equipment use</li>
              <li>Accept returns in accordance with the rental agreement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">4. Fees and Payments</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              RentFlow charges the following fees:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Platform fee: 10% of each successful rental transaction</li>
              <li>Payment processing fee: 2.5% + applicable taxes</li>
              <li>Premium listing features: Additional fees may apply</li>
            </ul>
            <p className="text-primary-700 leading-relaxed mt-3">
              Payments are processed securely through our payment partners. Funds will be transferred 
              to your registered bank account within 3-5 business days after the rental period ends.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">5. Equipment Standards</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              All equipment listed must meet the following standards:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Safe for use and properly maintained</li>
              <li>Compliant with all safety regulations and standards</li>
              <li>Free from defects that could cause injury or damage</li>
              <li>Accompanied by necessary safety instructions</li>
              <li>Properly sanitized and cleaned before each rental</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">6. Insurance and Liability</h2>
            <p className="text-primary-700 leading-relaxed">
              Vendors are responsible for maintaining appropriate insurance coverage for their rental 
              equipment. RentFlow provides limited protection against damage during rentals, but vendors 
              should have their own insurance policies to cover equipment damage, theft, or liability claims.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">7. Cancellation Policy</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              Vendors may set their own cancellation policies, choosing from:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li><strong>Flexible:</strong> Full refund up to 24 hours before rental start</li>
              <li><strong>Moderate:</strong> Full refund up to 5 days before rental start</li>
              <li><strong>Strict:</strong> 50% refund up to 7 days before rental start</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">8. Prohibited Items</h2>
            <p className="text-primary-700 leading-relaxed mb-3">
              The following items cannot be listed on RentFlow:
            </p>
            <ul className="list-disc pl-6 text-primary-700 space-y-2">
              <li>Weapons or items designed to cause harm</li>
              <li>Illegal substances or paraphernalia</li>
              <li>Counterfeit or stolen goods</li>
              <li>Items that infringe on intellectual property rights</li>
              <li>Hazardous materials without proper handling permits</li>
              <li>Items prohibited by local laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">9. Account Suspension</h2>
            <p className="text-primary-700 leading-relaxed">
              RentFlow reserves the right to suspend or terminate vendor accounts for violations of this 
              agreement, including but not limited to: fraudulent activity, repeated customer complaints, 
              listing prohibited items, or failure to fulfill rental obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">10. Dispute Resolution</h2>
            <p className="text-primary-700 leading-relaxed">
              In case of disputes between vendors and customers, RentFlow will act as a mediator and make 
              reasonable efforts to resolve the issue fairly. Both parties agree to cooperate with the 
              dispute resolution process and accept RentFlow's final decision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-3">11. Contact Information</h2>
            <p className="text-primary-700 leading-relaxed">
              For vendor support and inquiries, please contact us at:
            </p>
            <p className="text-primary-700 mt-2">
              Email: <a href="mailto:vendors@rentflow.com" className="text-primary-900 hover:underline">vendors@rentflow.com</a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-200">
          <Link 
            to="/signup/vendor" 
            className="btn btn-primary"
          >
            Back to Vendor Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
