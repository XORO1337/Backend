import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'faq'>('contact');

  const faqs = [
    {
      question: "How do I place a bulk order?",
      answer: "Navigate to the 'Browse Products' section, select your desired product, enter the quantity you need, and click 'Place Order'. Our team will confirm your order within 24 hours."
    },
    {
      question: "What are the payment terms?",
      answer: "We offer flexible payment terms including 30-day credit for verified distributors. Payment can be made via bank transfer, UPI, or cheque."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for urgent orders at additional cost."
    },
    {
      question: "Can I return or exchange products?",
      answer: "Yes, we accept returns within 7 days of delivery for defective items. Exchange requests are handled case-by-case basis."
    },
    {
      question: "Do you offer volume discounts?",
      answer: "Yes, we offer tiered pricing based on order quantity. Contact our sales team for custom pricing on large orders."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h2>
        <p className="text-gray-600">Get help with your orders and account</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Contact Us
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'faq'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          FAQ
        </button>
      </div>
      
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Phone className="text-indigo-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Speak directly with our support team for immediate assistance.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">Toll-free:</span>
                  <span className="text-sm text-indigo-600 ml-2">1800-123-4567</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">Mon-Fri: 9AM-6PM IST</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Mail className="text-indigo-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Send us your queries and we'll respond within 24 hours.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">Email:</span>
                  <span className="text-sm text-indigo-600 ml-2">support@rootsreach.com</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">Response within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <MessageCircle className="text-indigo-600 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Send us a Message</h3>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What's this regarding?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please describe your issue or question..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
      
      {activeTab === 'faq' && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <span className="text-indigo-600 group-open:rotate-180 transition-transform">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Support;