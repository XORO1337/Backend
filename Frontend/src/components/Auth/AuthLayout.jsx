import React from 'react';
import { Users, Heart, Sprout, Leaf } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDEwLDE4NSwyMDksMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      
      {/* Minimal decorative elements */}
      <div className="absolute top-16 left-8 w-12 h-12 bg-emerald-200/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-12 w-16 h-16 bg-teal-200/15 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/4 right-16 w-10 h-10 bg-blue-200/20 rounded-full blur-lg animate-pulse delay-500" />

      {/* Scrollable container */}
      <div className="h-screen overflow-y-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <style>{`
  .myClass {
    color: red;
  }
`}</style>


        {/* Compact Header */}
        <div className="relative z-10 pt-6 pb-4 flex-shrink-0">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="relative group">
                {/* Compact logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-white transform -rotate-12 animate-pulse" />
                    <div className="absolute -top-0.5 -right-0.5">
                      <Sprout className="w-4 h-4 text-emerald-200 animate-bounce delay-500" />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping"></div>
                </div>
                
                {/* Compact orbiting elements */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Users className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse delay-300">
                  <Heart className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent tracking-tight">
                RootsReach
              </h1>
              <div className="flex items-center justify-center space-x-2 text-emerald-700/80 text-sm">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Empowering Communities</span>
                <Heart className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span className="font-medium">Growing Together</span>
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center px-4 pb-8">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Compact footer */}
        <div className="relative z-10 text-center pb-6">
          <div className="flex items-center justify-center space-x-2 text-emerald-600/70 font-medium text-xs">
            <Users className="w-3 h-3" />
            <span>Building bridges between communities</span>
            <Heart className="w-3 h-3 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;