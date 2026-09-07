import React, { useState } from 'react';
import { NPDSample } from '../../types/npd';
import {
  AlertTriangle,
  Lightbulb,
  Clock,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Building,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
  FileText,
  ListTodo,
} from 'lucide-react';
import { formatDate } from '../../utils/npdHelpers';

interface ManagementInsightsProps {
  samples: NPDSample[];
  onSelectSample: (sample: NPDSample) => void;
}

export const ManagementInsights: React.FC<ManagementInsightsProps> = ({
  samples,
  onSelectSample,
}) => {
  const [isGeneratingAIReport, setIsGeneratingAIReport] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(false);

  // Identify customers with longest pending feedback (> 7 days)
  const pendingFeedbackCustomers = [
    { customer: 'Polyflex Packaging Ltd.', grade: 'ALOK-HD-BL-902', daysWaiting: 16, contact: 'Sanjay Deshmukh', assigned: 'R. K. Verma' },
    { customer: 'Supreme Industries Ltd.', grade: 'ALOK-UV-ST-400', daysWaiting: 14, contact: 'Amit Sharma', assigned: 'Dr. S. Nair' },
    { customer: 'Cosmo Films Ltd.', grade: 'ALOK-MB-CLEAR-08', daysWaiting: 11, contact: 'Rahul Verma', assigned: 'Dr. S. Nair' },
    { customer: 'Garware Hi-Tech Films', grade: 'ALOK-UV-PET-80', daysWaiting: 9, contact: 'Vikram Joshi', assigned: 'Dr. S. Nair' },
    { customer: 'Essel Propack (EPL)', grade: 'ALOK-MB-WHITE-99', daysWaiting: 8, contact: 'M. Patel', assigned: 'Priya Mehta' },
  ];

  const handleGenerateAIExecutiveSummary = () => {
    setIsGeneratingAIReport(true);
    setTimeout(() => {
      setIsGeneratingAIReport(false);
      setAiReportGenerated(true);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Management Intelligence & Operational Bottlenecks
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
              3 Critical Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated bottleneck identification, feedback aging flags, and strategic recommendations for Alok Masterbatches R&D and Sales leadership.
          </p>
        </div>

        <button
          onClick={handleGenerateAIExecutiveSummary}
          disabled={isGeneratingAIReport}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGeneratingAIReport ? 'Analyzing NPD Telemetry...' : 'Generate Executive Brief'}</span>
        </button>
      </div>

      {/* AI Generated Executive Brief Banner (if requested) */}
      {aiReportGenerated && (
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-blue-100">
                Alok Masterbatches Executive Brief • July 2026 Operations
              </span>
            </div>
            <span className="text-[10px] bg-blue-800/80 px-2 py-0.5 rounded text-blue-200 font-mono">
              Generated: Today
            </span>
          </div>
          <div className="text-xs text-slate-200 space-y-2 leading-relaxed">
            <p>
              • <strong>Output & TAT Velocity:</strong> Lab throughput hit 142 developed samples in July with overall average development TAT declining to <strong>5.8 days</strong> (within 7.0-day target), representing an 18.5% efficiency improvement compared to April.
            </p>
            <p>
              • <strong>Critical Chokepoints:</strong> Customer trial feedback latency remains the single largest operational friction point, with 32 samples waiting an average of 11.4 days. Supreme Industries and Polyflex Packaging have surpassed 14 days without trial closure.
            </p>
            <p>
              • <strong>Redevelopment Root Cause:</strong> Redevelopment rate stabilized at 12.7% (18 samples). 61.1% of re-cycles originate from initial shade delta-E mismatch and customer specification pivots during trial.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 Management Bottlenecks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bottleneck 1 */}
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full flex items-start justify-end p-2">
            <span className="text-xs font-black text-rose-600 font-mono">#1</span>
          </div>
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <Clock className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-rose-800">
              Customer Trial Feedback Delay
            </h3>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mb-1">
            32 Samples (22.5%)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Samples dispatched to customer plants remain in "Pending Feedback" for an average of 11.4 days due to client extrusion line scheduling delays.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Impact: High Inventory & SLA</span>
            <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Action: Sales Escalation</span>
          </div>
        </div>

        {/* Bottleneck 2 */}
        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full flex items-start justify-end p-2">
            <span className="text-xs font-black text-amber-600 font-mono">#2</span>
          </div>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <RotateCcw className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800">
              Colour Shade Mismatch in Trials
            </h3>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mb-1">
            6 Samples (33.3% of Redev)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Spectrophotometer measurements on laboratory press plaques deviate from customer injection molding wall-thickness and polymer matrix.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Impact: Cycle #2 R&D Overhead</span>
            <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Action: Trial Plaque Calibration</span>
          </div>
        </div>

        {/* Bottleneck 3 */}
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full flex items-start justify-end p-2">
            <span className="text-xs font-black text-blue-600 font-mono">#3</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-blue-800">
              Specialty Additive Raw Material Lead Time
            </h3>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mb-1">
            14 Samples on Hold
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Biodegradable PLA compounders and UL-94 V0 flame retardant masterbatch formulations delayed due to overseas sample import customs.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Impact: 14.8 Days Max TAT</span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Action: Buffer Stock Policy</span>
          </div>
        </div>
      </div>

      {/* Two-Column Detail: Aging Feedback vs Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Aging Customer Feedback */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Customers with Longest Pending Feedback (&gt; 7 Days Target)
              </h3>
            </div>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              SLA Breach Alert
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {pendingFeedbackCustomers.map((c, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-bold text-slate-900">{c.customer}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-blue-600 font-semibold">{c.grade}</span>
                    <span>•</span>
                    <span>Assigned: {c.assigned}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-xs">
                    {c.daysWaiting} Days Waiting
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Contact: {c.contact}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Automated CRM notifications scheduled every 72 hours</span>
            <button className="text-blue-600 font-bold hover:underline">
              Email All In-Charges
            </button>
          </div>
        </div>

        {/* Strategic Management Action Items */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Action Items for Management Review
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Q2 Priority
            </span>
          </div>

          <div className="p-4 space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200">
              <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                1. Institutionalize 7-Day Trial SLA with Sales Field Team
              </div>
              <p className="text-slate-700 leading-relaxed">
                Mandate that sales officers log client trial dates within 48 hours of dispatch and capture technical feedback by day 7.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                2. Lab Spectrophotometer Calibration with Customer Resins
              </div>
              <p className="text-slate-700 leading-relaxed">
                Require base virgin polymer samples from the customer to minimize ΔE shift caused by resin yellowness index variations.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
              <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                3. Fast-Track Pilot Compounding for Repeat Grades
              </div>
              <p className="text-slate-700 leading-relaxed">
                For additional existing-grade sample requests (38 in July), route directly to QC sampling bench to bypass R&D formulation queue.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Next R&D Strategy Review: First Monday of August</span>
            <span className="font-semibold text-slate-700">Owner: VP Technical</span>
          </div>
        </div>
      </div>
    </div>
  );
};
