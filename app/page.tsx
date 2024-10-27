'use client';

import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2A2533] to-[#201B28] p-8">
      <div className="max-w-6xl mx-auto relative">
        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Headline Box */}
          <div className="col-span-2">
            <div className="bg-gradient-to-br from-[#3B3642] to-[#322B3D] rounded-2xl p-10 h-[240px] flex items-center group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-white/5">
              <div className="space-y-4">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 text-6xl font-light leading-tight">
                  Automated Machine Learning and MLOps Platform
                </h1>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Secondary Text Box */}
            <div className="bg-gradient-to-br from-[#3B3642] to-[#322B3D] rounded-2xl p-6 h-[160px] flex items-center group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-white/5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 text-3xl font-light leading-tight">
                Streamline Your ML Workflow from Data Ingestion to Deployment
              </span>
            </div>

            {/* Upload Button */}
            <Link href={'/upload'}>
            <button 
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl px-8 py-4 w-full font-medium text-lg 
                         hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300
                         shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 mt-4"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Dataset
              </div>
            </button>
            </Link>

            {/* Stats Container */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Models Trained', value: '1.2K+' },
                { label: 'Accuracy Rate', value: '99.9%' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#322B3D]/50 rounded-xl p-4 border border-white/5">
                  <div className="text-purple-300 text-2xl font-semibold">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -bottom-40 left-0 right-0 flex justify-between gap-6">
          {[
            'Data Preprocessing',
            'Model Training',
            'Evaluation',
            'Deployment'
          ].map((step, i) => (
            <div 
              key={i} 
              className="h-[120px] bg-gradient-to-b from-[#322B3D] to-[#201B28] rounded-t-2xl flex-1
                         hover:from-[#3B3642] hover:to-[#2A2533] transition-all duration-300 p-6
                         border-t border-l border-r border-white/5"
            >
              <div className="text-gray-400 text-lg font-medium">{step}</div>
              <div className="text-purple-300 text-sm mt-2">Stage {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
