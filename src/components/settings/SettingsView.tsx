import React, { useState } from 'react';
import { TATTargets } from '../../types/npd';
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  Clock,
  Building,
  Bell,
  Mail,
  ShieldCheck,
  Server,
  Layers,
} from 'lucide-react';

interface SettingsViewProps {
  targets: TATTargets;
  onUpdateTargets: (targets: TATTargets) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  targets,
  onUpdateTargets,
}) => {
  const [formData, setFormData] = useState<TATTargets>({ ...targets });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Email notifications toggles (mock)
  const [notifyExceededTat, setNotifyExceededTat] = useState(true);
  const [notifyRedevelopment, setNotifyRedevelopment] = useState(true);
  const [notifyTrialFeedback, setNotifyTrialFeedback] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTargets(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    const defaults: TATTargets = {
      developmentDays: 7,
      dispatchDays: 2,
      trialDays: 5,
      feedbackDays: 7,
    };
    setFormData(defaults);
    onUpdateTargets(defaults);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            NPD System Configurations & TAT Target SLAs
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure corporate turnaround thresholds, warning escalation limits, and notification triggers for Alok Masterbatches Pvt. Ltd.
        </p>
      </div>

      {/* SLA Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Target SLA Turnaround Durations</h3>
            <p className="text-xs text-slate-500">
              Samples exceeding these thresholds will be automatically flagged across all dashboards and registers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* Development Target */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                1. Lab Development Target (Days)
              </label>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-slate-500 text-[11px]">
              From Request Intake to Sample QC Approval in R&D laboratory.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={formData.developmentDays}
                onChange={(e) => setFormData({ ...formData, developmentDays: Number(e.target.value) })}
                className="w-24 bg-white p-2 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-slate-600 font-medium">Days (Management Target: 7 Days)</span>
            </div>
          </div>

          {/* Dispatch Target */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                2. Packing & Dispatch Target (Days)
              </label>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-slate-500 text-[11px]">
              From QC Release to courier handover and LR generation.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={15}
                value={formData.dispatchDays}
                onChange={(e) => setFormData({ ...formData, dispatchDays: Number(e.target.value) })}
                className="w-24 bg-white p-2 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-slate-600 font-medium">Days (Target: 2 Days)</span>
            </div>
          </div>

          {/* Customer Trial Target */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                3. Plant Trial Execution Target (Days)
              </label>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-slate-500 text-[11px]">
              Expected transit time + customer extrusion trial slotting.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={formData.trialDays}
                onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                className="w-24 bg-white p-2 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-slate-600 font-medium">Days (Target: 5 Days)</span>
            </div>
          </div>

          {/* Feedback Target */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                4. Trial Feedback Target (Days)
              </label>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-slate-500 text-[11px]">
              From Trial Execution to formal written technical feedback.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={formData.feedbackDays}
                onChange={(e) => setFormData({ ...formData, feedbackDays: Number(e.target.value) })}
                className="w-24 bg-white p-2 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-slate-600 font-medium">Days (Management Target: 7 Days)</span>
            </div>
          </div>
        </div>

        {/* Email & Escalation Policies */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Automated Escalation Triggers
          </h4>
          
          <div className="space-y-2 text-xs text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyExceededTat}
                onChange={(e) => setNotifyExceededTat(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Send daily digest to VP Technical for samples exceeding 7-day development target</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyRedevelopment}
                onChange={(e) => setNotifyRedevelopment(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Notify R&D Chemist immediately when customer logs "Redevelopment Required"</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTrialFeedback}
                onChange={(e) => setNotifyTrialFeedback(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Send automated reminder to Sales In-charge when feedback is pending &gt; 7 days</span>
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                Target configurations updated successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* System info */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Alok Masterbatches NPD Application • v1.0 MVP Prototype</span>
        </div>
        <span>Database Ready (PostgreSQL / Supabase Schema Extensible)</span>
      </div>
    </div>
  );
};
