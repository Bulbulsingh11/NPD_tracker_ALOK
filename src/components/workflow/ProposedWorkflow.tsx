import React, { useState } from 'react';
import { NPD_WORKFLOW_STEPS } from '../../data/demoData';
import {
  Workflow,
  Clock,
  Building,
  CheckCircle2,
  FileText,
  RotateCcw,
  Layers,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';

export const ProposedWorkflow: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const selectedStep =
    NPD_WORKFLOW_STEPS.find((s) => s.stepNumber === activeStepId) || NPD_WORKFLOW_STEPS[0];

  const getDepartmentBadge = (dept: string) => {
    switch (dept) {
      case 'Sales & Marketing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'R&D Laboratory':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Pilot Compounding':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Quality Control (QC)':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dispatch & Logistics':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Customer QA / Plant':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Commercial & ERP':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-blue-600" /> Standard Operating Procedure (SOP) • 10-Step NPD Workflow
            </h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              End-to-End Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Standardized 10-stage process mapping for Alok Masterbatches to systematize sample tracking, cross-department handoffs, and TAT control.
          </p>
        </div>
      </div>

      {/* Interactive 10-Step Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 10-Step Timeline List */}
        <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              NPD Lifecycle Progression Steps
            </h3>
            <span className="text-[11px] text-slate-400">Click any step to inspect details</span>
          </div>

          <div className="space-y-2">
            {NPD_WORKFLOW_STEPS.map((step) => {
              const isSelected = step.stepNumber === activeStepId;
              const isRedev = step.isConditional;

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStepId(step.stepNumber)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-200 shadow-2xs'
                      : isRedev
                      ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] font-mono shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isRedev
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.stepNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{step.title}</span>
                        {isRedev && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[9px] font-bold">
                            CONDITIONAL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{step.department}</span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-slate-700">{step.slaTarget}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Step Inspector Details Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                  {selectedStep.stepNumber}
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Step Inspector</span>
                  <h3 className="text-xs font-bold text-slate-900">{selectedStep.title}</h3>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDepartmentBadge(selectedStep.department)}`}>
                {selectedStep.department}
              </span>
            </div>

            {/* Role Responsibility */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Role</span>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2 text-slate-800 font-semibold">
                <User className="w-4 h-4 text-blue-600" />
                <span>{selectedStep.role}</span>
              </div>
            </div>

            {/* Description & Action Required */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Action Required</span>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                {selectedStep.actionRequired}
              </p>
            </div>

            {/* Turnaround SLA */}
            <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-900 font-semibold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Target SLA Window:</span>
              </div>
              <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                {selectedStep.slaTarget}
              </span>
            </div>

            {/* Key Deliverables */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Deliverables & Artifacts</span>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{selectedStep.deliverables}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Alok Masterbatches SOP-NPD-01</span>
            <span className="font-semibold text-slate-600">ISO 9001:2015 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
