import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Cpu, Settings, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface Unit {
  id: number;
  status: string;
  lastCycle: number;
  healthScore: number;
}

interface UnitListProps {
  units: Unit[];
  selectedUnit: number | null;
  onSelectUnit: (id: number) => void;
}

export const UnitList: React.FC<UnitListProps> = ({ units, selectedUnit, onSelectUnit }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-[#888] text-xs uppercase tracking-widest mb-4 font-mono px-2">Active IoT Units</h3>
      {units.map((unit) => (
        <motion.div
          key={unit.id}
          whileHover={{ x: 4 }}
          onClick={() => onSelectUnit(unit.id)}
          className={`
            cursor-pointer p-4 border rounded-lg transition-all duration-200
            ${selectedUnit === unit.id 
              ? 'bg-[#222] border-[#444] shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
              : 'bg-[#1a1a1a] border-[#333] hover:border-[#444]'}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${unit.status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                <Cpu size={18} />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Unit #{unit.id.toString().padStart(3, '0')}</div>
                <div className="text-[#666] text-[10px] font-mono uppercase">Cycle {unit.lastCycle}</div>
              </div>
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              unit.status === 'Healthy' ? 'text-green-500 bg-green-500/10' : 'text-amber-500 bg-amber-500/10'
            }`}>
              {unit.status}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[#666] mb-1 uppercase font-mono">
              <span>Health Score</span>
              <span>{unit.healthScore}%</span>
            </div>
            <div className="h-1 w-full bg-[#333] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${unit.healthScore}%` }}
                className={`h-full ${unit.healthScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
