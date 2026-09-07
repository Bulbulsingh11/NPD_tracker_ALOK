import React, { useState } from 'react';
import { NPDSample, TrialOutcome } from '../../types/npd';
import { SALES_EXECUTIVES } from '../../data/demoData';
import {
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  AlertCircle,
  Building,
  User,
  ChevronRight,
  Eye,
  Star,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  formatDate,
  exportToCSV,
  getStatusBadgeStyle,
  getCalculatedPostSampleTat,
  getCalculatedFeedbackPendingDays,
} from '../../utils/npdHelpers';

interface TrialFeedbackProps {
  samples: NPDSample[];
  onSelectSample: (sample: NPDSample) => void;
}

export const TrialFeedback: React.FC<TrialFeedbackProps> = ({
  samples,
  onSelectSample,
}) => {
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [salesExecFilter, setSalesExecFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Samples that have reached sample dispatch or customer trial phase
  const trialEligibleSamples = samples.filter(
    (s) =>
      s.requirementMode === 'SAMPLE + PRICE' &&
      (s.sampleDispatchDate || s.status === 'SAMPLE / PRICE SHARED' || s.trialResult || s.customerFeedbackRemarks)
  );

  const filteredSamples = trialEligibleSamples.filter((sample) => {
    const matchesSearch =
      sample.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.productGrade.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (salesExecFilter !== 'ALL' && sample.requestedBy !== salesExecFilter) {
      return false;
    }

    if (resultFilter === 'Approved') return sample.trialResult === 'Approved';
    if (resultFilter === 'Redevelopment Required') return sample.trialResult === 'Redevelopment Required';
    if (resultFilter === 'Rejected') return sample.trialResult === 'Rejected';
    if (resultFilter === 'Pending Feedback') return !sample.trialResult || sample.trialResult === 'Trial Pending';

    return true;
  });

  const handleExportTrials = () => {
    const exportData = filteredSamples.map((s) => ({
      'Request ID': s.id,
      'Sales Executive': s.requestedBy,
      'Customer': s.customer,
      'Product Grade': s.productGrade,
      'Dispatch Date': s.sampleDispatchDate || 'N/A',
      'Plant Trial Date': s.trialDate || 'N/A',
      'Trial Result': s.trialResult || 'Pending Feedback',
      'Post-Sample TAT (Days)': getCalculatedPostSampleTat(s) || 'Pending',
      'Feedback Remarks': s.customerFeedbackRemarks || 'N/A',
      'Spec Changes': s.customerRequirementChanges || 'None',
      'Next Action': s.nextAction || 'N/A',
    }));
    exportToCSV(exportData, `Alok_Customer_Trial_Feedback_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Customer Trial & Sales Executive Feedback Module
            </h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
              Sales Responsibility
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer plant trials, feedback turnaround time, formulation approval, and next commercial actions.
          </p>
        </div>

        <button
          onClick={handleExportTrials}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Feedback CSV</span>
        </button>
      </div>

      {/* Summary Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, customer, grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 outline-none"
          />
        </div>

        {/* Outcome Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Outcome:</span>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-800"
          >
            <option value="ALL">All Outcomes ({trialEligibleSamples.length})</option>
            <option value="Approved">Approved</option>
            <option value="Pending Feedback">Pending Feedback</option>
            <option value="Redevelopment Required">Redevelopment Required</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Sales Executive Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Sales Exec:</span>
          <select
            value={salesExecFilter}
            onChange={(e) => setSalesExecFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-800"
          >
            <option value="ALL">All Sales Executives</option>
            {SALES_EXECUTIVES.map((exec) => (
              <option key={exec} value={exec}>
                {exec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trial Feedback Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Sales Executive</th>
                <th className="p-3">Customer & Grade</th>
                <th className="p-3">Dispatched On</th>
                <th className="p-3">Trial Outcome</th>
                <th className="p-3">Post-Sample TAT</th>
                <th className="p-3">Customer Remarks</th>
                <th className="p-3">Next Action</th>
                <th className="p-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSamples.map((s) => {
                const postTat = getCalculatedPostSampleTat(s);
                const pendingDays = getCalculatedFeedbackPendingDays(s);

                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectSample(s)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {s.isPriority && <Star className="w-3 h-3 fill-amber-400 text-amber-500" />}
                        <span>{s.id}</span>
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                      {s.requestedBy}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.customer}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{s.productGrade}</div>
                    </td>

                    <td className="p-3 font-mono text-[11px] whitespace-nowrap text-slate-600">
                      {s.sampleDispatchDate ? formatDate(s.sampleDispatchDate) : 'Pending Dispatch'}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {s.trialResult === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      ) : s.trialResult === 'Redevelopment Required' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <RotateCcw className="w-3 h-3 text-amber-600" /> Redevelopment
                        </span>
                      ) : s.trialResult === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Clock className="w-3 h-3 text-purple-600" /> Feedback Pending
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-mono whitespace-nowrap font-bold text-[11px]">
                      {postTat !== undefined ? (
                        <span className="text-slate-800">{postTat} Days</span>
                      ) : pendingDays !== undefined ? (
                        <span className="text-amber-600">{pendingDays} Days (Pending)</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="p-3 text-[11px] text-slate-600 max-w-xs truncate">
                      {s.customerFeedbackRemarks ? (
                        <span>"{s.customerFeedbackRemarks}"</span>
                      ) : (
                        <span className="text-slate-400 italic">Trial underway at customer plant</span>
                      )}
                    </td>

                    <td className="p-3 text-[11px] text-slate-700 whitespace-nowrap font-medium">
                      {s.nextAction || '—'}
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSample(s);
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold transition-colors"
                      >
                        Enter Feedback
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
