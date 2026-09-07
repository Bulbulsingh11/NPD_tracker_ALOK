import React from 'react';
import { NPDStage, NPDStatus } from '../../types/npd';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  PauseCircle, 
  RotateCcw, 
  XCircle,
  Truck,
  FlaskConical,
  MessageSquare,
  FileCheck,
  PackageCheck
} from 'lucide-react';
import { getStageNumber } from '../../utils/npdHelpers';

interface LifecycleVisualizerProps {
  currentStage: NPDStage;
  status: NPDStatus;
  stagesCompleted?: string[];
}

const STAGES = [
  { id: 'REQUEST_RECEIVED', label: '1. Request Received', short: 'Request', icon: FileCheck },
  { id: 'DEVELOPMENT', label: '2. Development', short: 'R&D Lab', icon: FlaskConical },
  { id: 'SAMPLE_READY', label: '3. Sample Ready', short: 'QC Ready', icon: PackageCheck },
  { id: 'SAMPLE_DISPATCHED', label: '4. Dispatched', short: 'Dispatch', icon: Truck },
  { id: 'CUSTOMER_TRIAL', label: '5. Customer Trial', short: 'Trial', icon: Clock },
  { id: 'FEEDBACK', label: '6. Feedback', short: 'Feedback', icon: MessageSquare },
  { id: 'FINAL_DECISION', label: '7. Final Decision', short: 'Decision', icon: CheckCircle2 },
];

export const LifecycleVisualizer: React.FC<LifecycleVisualizerProps> = ({
  currentStage,
  status,
}) => {
  const currentStepNumber = getStageNumber(currentStage);

  const getStatusColor = () => {
    switch (status) {
      case 'APPROVED':
        return 'text-emerald-600 bg-emerald-50 border-emerald-300';
      case 'REDEVELOPMENT_REQUIRED':
        return 'text-amber-600 bg-amber-50 border-amber-300';
      case 'REJECTED':
        return 'text-rose-600 bg-rose-50 border-rose-300';
      case 'ON_HOLD':
        return 'text-slate-600 bg-slate-100 border-slate-300';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-300';
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
          Standard 7-Stage NPD Progression Tracker
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Current Stage:</span>
          <span className={`px-2 py-0.5 rounded font-bold border text-xs ${getStatusColor()}`}>
            {currentStage.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden sm:block absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0" />
        
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-1 relative z-10">
          {STAGES.map((s, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStepNumber || (stepNum === 7 && currentStepNumber === 7 && status === 'APPROVED');
            const isCurrent = stepNum === currentStepNumber;
            const Icon = s.icon;

            let stepColorClass = 'bg-white text-slate-400 border-slate-300';
            let iconColorClass = 'text-slate-400';
            let labelClass = 'text-slate-500';

            if (isCompleted) {
              stepColorClass = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
              iconColorClass = 'text-white';
              labelClass = 'text-emerald-700 font-semibold';
            } else if (isCurrent) {
              if (status === 'REDEVELOPMENT_REQUIRED') {
                stepColorClass = 'bg-amber-500 text-white border-amber-500 ring-4 ring-amber-100 shadow-xs';
                iconColorClass = 'text-white';
                labelClass = 'text-amber-700 font-bold';
              } else if (status === 'ON_HOLD') {
                stepColorClass = 'bg-slate-500 text-white border-slate-500 ring-4 ring-slate-100 shadow-xs';
                iconColorClass = 'text-white';
                labelClass = 'text-slate-700 font-bold';
              } else if (status === 'REJECTED') {
                stepColorClass = 'bg-rose-500 text-white border-rose-500 ring-4 ring-rose-100 shadow-xs';
                iconColorClass = 'text-white';
                labelClass = 'text-rose-700 font-bold';
              } else {
                stepColorClass = 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 shadow-xs';
                iconColorClass = 'text-white';
                labelClass = 'text-blue-700 font-bold';
              }
            }

            return (
              <div key={s.id} className="flex flex-col items-center text-center p-1">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${stepColorClass}`}
                >
                  <Icon className={`w-4 h-4 ${iconColorClass}`} />
                </div>
                <span className={`text-[11px] mt-1.5 leading-tight ${labelClass}`}>
                  {s.short}
                </span>
                <span className="text-[9px] text-slate-400">
                  Stage {stepNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcome Banner if Final Stage */}
      {currentStage === 'FINAL_DECISION' && (
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Final Evaluation Outcome:</span>
          <span className={`font-bold px-2.5 py-1 rounded-md text-xs uppercase tracking-wide border ${getStatusColor()}`}>
            {status.replace(/_/g, ' ')}
          </span>
        </div>
      )}
    </div>
  );
};
