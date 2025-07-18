import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'Maya' }) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Good morning, {userName}! ✨</h2>
      <p className="text-gray-600">Here's what's happening with your artisan business today.</p>
    </div>
  );
};

export default WelcomeSection;