// components/sections/JourneySteps.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  description: string;
  progress: number;
  color: string;
  fromLabel: string;
  toLabel: string;
}

interface JourneyStepsProps {
  steps: Step[];
}

const JourneySteps: React.FC<JourneyStepsProps> = ({ steps }) => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white rounded-full text-sm font-medium mb-4">
              YOUR JOURNEY
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Three simple steps to connection
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your path to meaningful conversations is just a few steps away
            </p>
          </motion.div>
        </div>
        
        <div className="space-y-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-8 flex flex-col md:flex-row items-start gap-6">
                {/* Number circle */}
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full"
                      style={{ backgroundColor: step.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${step.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                  
                  {/* Labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{step.fromLabel}</span>
                    <span>{step.toLabel}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySteps;