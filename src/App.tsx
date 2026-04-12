import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Cpu, 
  Database, 
  LayoutDashboard, 
  RefreshCw, 
  Settings, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { SensorChart } from './components/SensorChart';
import { UnitList } from './components/UnitList';
import { PredictiveAnalysis } from './components/PredictiveAnalysis';
import { analyzeSensorData } from './services/aiService';

export default function App() {
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      fetchHistory(selectedUnit);
    }
  }, [selectedUnit]);

  const fetchUnits = async () => {
    try {
      const res = await fetch('/api/units');
      const data = await res.json();
      setUnits(data);
      if (data.length > 0 && !selectedUnit) {
        setSelectedUnit(data[0].id);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching units:', error);
      setIsLoading(false);
    }
  };

  const fetchHistory = async (id: number) => {
    try {
      const res = await fetch(`/api/sensors/history/${id}`);
      const data = await res.json();
      setHistory(data.history);
      performAIAnalysis(data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const performAIAnalysis = async (sensorHistory: any[]) => {
    setIsAnalyzing(true);
    // Take the last 10 cycles for analysis
    const latestData = sensorHistory.slice(-10);
    const result = await analyzeSensorData(latestData);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <Zap className="text-blue-500" size={48} />
          <p className="text-[#666] font-mono tracking-widest text-sm uppercase">Initializing PdM System...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">PredictiveMaintenance<span className="text-blue-500">.AI</span></h1>
              <p className="text-[10px] text-[#666] font-mono uppercase tracking-widest leading-none">NASA C-MAPSS FD001 Patterns</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-white flex items-center gap-2">
              <LayoutDashboard size={16} className="text-blue-500" /> Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-[#666] hover:text-white transition-colors flex items-center gap-2">
              <Database size={16} /> Dataset
            </a>
            <a href="#" className="text-sm font-medium text-[#666] hover:text-white transition-colors flex items-center gap-2">
              <Settings size={16} /> Config
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-[#aaa] uppercase">System Live</span>
            </div>
            <button 
              onClick={fetchUnits}
              className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-[#666] hover:text-white"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar - Unit Selection */}
        <aside className="lg:col-span-3 space-y-6">
          <UnitList 
            units={units} 
            selectedUnit={selectedUnit} 
            onSelectUnit={setSelectedUnit} 
          />
          
          <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
            <h4 className="text-[#666] text-[10px] uppercase font-mono mb-3">System Health</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#aaa]">API Latency</span>
                <span className="text-xs font-mono text-green-500">24ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#aaa]">AI Confidence</span>
                <span className="text-xs font-mono text-blue-500">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#aaa]">Uptime</span>
                <span className="text-xs font-mono text-[#aaa]">99.9%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Charts & Analysis */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] border border-[#333] p-5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#666] text-[10px] uppercase font-mono">Current Cycle</p>
                <Activity size={16} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{history.length > 0 ? history[history.length-1].cycle : '--'}</p>
              <p className="text-[10px] text-[#444] mt-1 font-mono uppercase">Operational Time</p>
            </div>
            
            <div className="bg-[#1a1a1a] border border-[#333] p-5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#666] text-[10px] uppercase font-mono">Avg Vibration</p>
                <Zap size={16} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold">
                {history.length > 0 ? (history.reduce((acc, curr) => acc + curr.vibration, 0) / history.length).toFixed(2) : '--'}
              </p>
              <p className="text-[10px] text-[#444] mt-1 font-mono uppercase">Hz / RMS</p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] p-5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#666] text-[10px] uppercase font-mono">Safety Status</p>
                <ShieldCheck size={16} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-500">SECURE</p>
              <p className="text-[10px] text-[#444] mt-1 font-mono uppercase">Protocol Active</p>
            </div>
          </div>

          {/* Middle Row - Charts & AI Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <SensorChart 
                data={history} 
                title="Sensor S4 (Temperature Trend)" 
                dataKey="s4" 
                color="#3b82f6" 
              />
              <SensorChart 
                data={history} 
                title="Vibration Analysis (Hz)" 
                dataKey="vibration" 
                color="#f59e0b" 
              />
            </div>
            <div className="xl:col-span-1">
              <PredictiveAnalysis analysis={analysis} isLoading={isAnalyzing} />
            </div>
          </div>

          {/* Bottom Row - Secondary Sensors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SensorChart 
              data={history} 
              title="Sensor S11 (Pressure Trend)" 
              dataKey="s11" 
              color="#10b981" 
            />
            <SensorChart 
              data={history} 
              title="Sensor S12 (Pressure Trend)" 
              dataKey="s12" 
              color="#8b5cf6" 
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#222] py-8 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#444] text-[10px] font-mono uppercase tracking-widest">
            © 2026 PredictiveMaintenance.AI // Industrial IoT Solutions
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#444] hover:text-[#666] text-[10px] font-mono uppercase tracking-widest transition-colors">Documentation</a>
            <a href="#" className="text-[#444] hover:text-[#666] text-[10px] font-mono uppercase tracking-widest transition-colors">API Reference</a>
            <a href="#" className="text-[#444] hover:text-[#666] text-[10px] font-mono uppercase tracking-widest transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
