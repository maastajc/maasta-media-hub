
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="text-maasta-purple">Policy</span>
            </h1>
            <p className="text-lg text-gray-600">
              <strong>Effective Date:</strong> 28/06/2025
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-maasta-purple/10 to-maasta-orange/10 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-maasta-purple mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Commitment</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Maasta, we value your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </div>
          </div>

          {/* What We Collect */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-maasta-orange mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">What We Collect</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Name, email, phone number, and demographic details</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Portfolio data including images, videos, links</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Audition and event participation history</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How We Use Your Data */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-maasta-purple mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Data</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-orange rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To create and maintain your user profile</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-orange rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To match talents with auditions, jobs, and events</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-orange rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To send updates and recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-maasta-orange rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To improve platform features and experience</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <UserCheck className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                You may update, delete, or request access to your personal data anytime. 
                Your data will never be sold to third parties.
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Data Protection Guarantee</p>
                <p className="text-sm text-gray-600">
                  We implement industry-standard security measures to protect your personal information 
                  and ensure it remains confidential and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Privacy */}
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Privacy?</h3>
            <p className="text-gray-600 mb-6">
              For more details or concerns about how we handle your data, please don't hesitate to reach out.
            </p>
            <a 
              href="mailto:privacy@maasta.in"
              className="inline-flex items-center bg-maasta-purple text-white px-6 py-3 rounded-lg hover:bg-maasta-purple/90 transition-colors font-medium"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
