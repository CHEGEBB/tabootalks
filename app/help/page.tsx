'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LayoutController from '@/components/layout/LayoutController';
import { ArrowLeft, MessageCircle, HelpCircle, Shield, CreditCard, User, Settings, CheckCircle, Send, Phone, Mail, Clock } from 'lucide-react';

const HelpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    helpType: '',
    message: ''
  });

  const helpOptions = [
    { id: 'account', label: 'Account Issues', icon: <User className="w-5 h-5" /> },
    { id: 'billing', label: 'Billing & Credits', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'technical', label: 'Technical Problems', icon: <Settings className="w-5 h-5" /> },
    { id: 'safety', label: 'Safety & Reporting', icon: <Shield className="w-5 h-5" /> },
    { id: 'features', label: 'How to Use Features', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'other', label: 'Other Issues', icon: <MessageCircle className="w-5 h-5" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHelpTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      helpType: type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.helpType || !formData.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Help request submitted:', formData);
      
      // Show success state
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Error submitting help request:', error);
      alert('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/main');
  };

  return (
    <div className="min-h-screen bg-white">
      <LayoutController />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <HelpCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600 mt-1">We&apos;re here to help you with any issues or questions</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Image & Info */}
          <div>
           {/* Image with floating pointer */}
<div className="relativerounded-2xl p-6 mb-6">
  <div className="relative h-64">
    <Image
      src="/assets/person.png"
      alt="Help illustration"
      fill
      className="object-contain"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </div>
  
  <div className="mt-6">
    <h3 className="font-bold text-gray-900 mb-3">Quick Help</h3>
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
        <Clock className="w-5 h-5 text-purple-600" />
        <div>
          <p className="font-medium text-gray-900">Response Time</p>
          <p className="text-sm text-gray-600">Typically within 24 hours</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
        <Mail className="w-5 h-5 text-purple-600" />
        <div>
          <p className="font-medium text-gray-900">Email Support</p>
          <p className="text-sm text-gray-600">support@example.com</p>
        </div>
      </div>
    </div>
  </div>
</div>
            
            {/* Tips */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">Before You Submit</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-700">Check our FAQ section for common solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-700">Include relevant screenshots if possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-700">Provide as much detail as you can</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            {isSuccess ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h2>
                  <p className="text-gray-600 mb-8">
                    Thank you for reaching out. Our support team has received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={handleBackToHome}
                    className="w-full py-3.5 bg-[#5e17eb] text-white font-medium rounded-lg hover:bg-[#4a13c4] transition-all duration-300"
                  >
                    Go Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">How Can We Help You?</h2>
                <p className="text-gray-600 mb-8">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 text-sm border text-gray-500 placeholder:text-gray-500 border-gray-300 rounded-lg outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 text-sm border text-gray-500 placeholder:text-gray-500 border-gray-300 rounded-lg outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all"
                      required
                    />
                  </div>

                  {/* Help Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      What do you need help with? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {helpOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleHelpTypeSelect(option.id)}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                            formData.helpType === option.id
                              ? 'border-[#5e17eb] bg-[#5e17eb]/5'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            formData.helpType === option.id
                              ? 'bg-[#5e17eb] text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {option.icon}
                          </div>
                          <span className="text-xs font-medium text-gray-900">{option.label}</span>
                        </button>
                      ))}
                    </div>
                    {formData.helpType && (
                      <p className="text-sm text-gray-500 mt-2">
                        Selected: {helpOptions.find(o => o.id === formData.helpType)?.label}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Describe your issue *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide as much detail as possible about your issue..."
                      rows={5}
                      className="w-full px-4 py-3 text-gray-500 placeholder:text-gray-500 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#5e17eb] text-white font-medium rounded-lg hover:bg-[#4a13c4] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Help Request
                      </>
                    )}
                  </button>
                </form>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Other Ways to Contact Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Email</span>
                      </div>
                      <p className="text-sm text-gray-600">support@yourdomain.com</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Phone</span>
                      </div>
                      <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {!isSuccess && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I reset my password?",
                  answer: "Go to Settings > Account > Change Password. You'll receive an email with reset instructions."
                },
                {
                  question: "How do I purchase credits?",
                  answer: "Navigate to the Credits page from your dashboard and select a package. All payments are secure."
                },
                {
                  question: "Can I delete my account?",
                  answer: "Yes, go to Settings > Account > Delete Account. Note: This action is permanent and cannot be undone."
                },
                {
                  question: "How do I report inappropriate content?",
                  answer: "Click the three dots on any post and select 'Report Abuse'. Our team reviews all reports."
                }
              ].map((faq, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HelpPage;