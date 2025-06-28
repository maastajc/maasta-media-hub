
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, UserCheck, Shield, AlertTriangle, RefreshCw, Mail } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of <span className="text-maasta-purple">Service</span>
            </h1>
            <p className="text-lg text-gray-600">
              Welcome to Maasta! Please read these terms carefully.
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-maasta-purple/10 to-maasta-orange/10 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 text-maasta-purple mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Agreement</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                By using our platform, you agree to the following terms and conditions. 
                These terms govern your use of Maasta and all related services.
              </p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Eligibility */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <UserCheck className="w-6 h-6 text-maasta-orange mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Eligibility</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                You must be 16 years or older to register as an artist or organizer on our platform.
              </p>
            </div>

            {/* User Responsibility */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">User Responsibility</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for the accuracy of the information shared in your portfolio or auditions. 
                Please ensure all content is truthful and up-to-date.
              </p>
            </div>

            {/* Organizer Guidelines */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Organizer Guidelines</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Only verified organizers may post auditions and events. False postings will lead to suspension. 
                We maintain strict verification processes to ensure authentic opportunities.
              </p>
            </div>

            {/* Data Usage */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Data Usage</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By uploading media and profile content, you grant Maasta the right to display and share your portfolio 
                for industry visibility. This helps connect you with relevant opportunities.
              </p>
            </div>

            {/* Termination */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Termination</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Users violating community guidelines or posting inappropriate content may be removed without prior notice. 
                We are committed to maintaining a safe and professional environment for all users.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-6 h-6 text-maasta-purple mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Changes to Terms</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Maasta reserves the right to update these terms at any time. Continued use implies agreement to revised terms. 
                We will notify users of significant changes via email or platform notifications.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-maasta-orange mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Questions About Terms?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              If you have any questions about these terms or need clarification on any aspect, 
              we're here to help.
            </p>
            <a 
              href="mailto:terms@maasta.in"
              className="inline-flex items-center bg-maasta-purple text-white px-6 py-3 rounded-lg hover:bg-maasta-purple/90 transition-colors font-medium"
            >
              Contact Legal Team
            </a>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Last updated: June 28, 2025</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
