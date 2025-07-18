import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { Tutorial } from '../types';

interface TutorialsCardProps {
  tutorials: Tutorial[];
  onPlayTutorial?: (tutorialId: number) => void;
}

const TutorialsCard: React.FC<TutorialsCardProps> = ({ tutorials, onPlayTutorial }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-blue-100">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
        Learn & Tutorials
      </h3>
      
      <div className="space-y-4">
        {tutorials.slice(0, 3).map((tutorial) => (
          <div 
            key={tutorial.id} 
            onClick={() => onPlayTutorial?.(tutorial.id)}
            className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-blue-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <div className="relative">
              <img 
                src={tutorial.thumbnail} 
                alt={tutorial.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{tutorial.title}</h4>
              <p className="text-sm text-gray-600">{tutorial.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorialsCard;