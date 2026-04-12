import React from 'react';
import { AlertCircle, BrainCircuit, CheckCircle2, Info, ShieldAlert, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalysisResult {
  failureProbability: number;
  predictedRUL: number;
  status: string;
  recommendations: string[];
  keyFactors: string[];
}

interface PredictiveAnalysisProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

export const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-lg h-full flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <BrainCircuit className="text-blue-500" size={40} />
        </motion.div>
        <p className="text-[#666] font-mono text-sm animate-pulse">AI ANALYZING SENSOR PATTERNS...</p>
      </div>
    );
  }

  if (!analysis) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-lg h-full">
      <div className="flex items-center gap-2 mb-6">
        <BrainCircuit className="text-blue-500" size={20} />
        <h3 className="text-white font-medium">AI Predictive Insights</h3>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-1">
          <p className="text-[#666] text-[10px] uppercase font-mono tracking-wider">Failure Probability</p>
          <p className={`text-3xl font-bold ${analysis.failureProbability > 0.7 ? 'text-red-500' : 'text-white'}`}>
            {(analysis.failureProbability * 100).toFixed(1)}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[#666] text-[10px] uppercase font-mono tracking-wider">Predicted RUL</p>
          <p className="text-3xl font-bold text-white">
            {analysis.predictedRUL} <span className="text-xs font-normal text-[#666]">Cycles</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[#666] text-[10px] uppercase font-mono tracking-wider mb-3">Key Risk Factors</p>
          <div className="flex flex-wrap gap-2">
            {analysis.keyFactors.map((factor, i) => (
              <span key={i} className="bg-[#222] border border-[#333] text-[#aaa] text-[10px] px-2 py-1 rounded font-mono">
                {factor}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[#666] text-[10px] uppercase font-mono tracking-wider mb-3">Maintenance Recommendations</p>
          <ul className="space-y-3">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-[#aaa]">
                <div className="mt-0.5 text-blue-500">
                  <Info size={14} />
                </div>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
