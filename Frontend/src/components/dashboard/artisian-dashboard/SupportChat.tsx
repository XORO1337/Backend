import React from 'react';
import { MessageCircle } from 'lucide-react';

interface SupportChatProps {
  onOpenChat?: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ onOpenChat }) => {
  return (
    <div className="fixed bottom-6 right-6">
      <button 
        onClick={onOpenChat}
        className="bg-gradient-to-r from-rose-400 to-orange-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SupportChat;