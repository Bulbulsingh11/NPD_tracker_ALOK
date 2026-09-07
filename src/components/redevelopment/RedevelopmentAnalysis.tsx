import React, { useState } from 'react';
import { NPDSample, RedevelopmentReason } from '../../types/npd';
import {
  RotateCcw,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Search,
  Download,
  ChevronRight,
  Eye,
  Star,
  Layers,
  FlaskConical,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatDate, getStatusBadgeStyle, exportToCSV } from '../../utils/npdHelpers';

interface RedevelopmentAnalysisProps {
  samples: NPDSample[];
  onSelectSample: (sample: NPDSample) => void;
}

export const RedevelopmentAnalysis: React.FC<RedevelopmentAnalysisProps> = ({
  samples,
  onSelectSample,
}) => {
  const [reasonFilter, setReasonFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Monthly Redevelopment Rate Trend Data
  const monthlyRedevTrend = [
    { month: 'Apr 26', totalDev: 138, redevCount: 20, rate: 14.5, target: 10.0 },
    { month: 'May 26', totalDev: 131, redevCount: 19, rate: 14.5, target: 10.0 },
    { month: 'Jun 26', totalDev: 122, redevCount: 14, rate: 11.5, target: 10.0 },
    { month: 'Jul 26', totalDev: 142, redevCount: 18, rate: 12.7, target: 10.0 },
  ];

  const reasonStats = [
    { name: 'Colour Mismatch', count: 11, pct: '61.1%', color: '#3b82f6' },
    { name: 'Quality Issue', count: 3, pct: '16.7%', color: '#8b5cf6' },
    { name: 'Performance Issue', count: 2, pct: '11.1%', color: '#ec4899' },
    { name: 'Customer Requirement Change', count: 1, pct: '5.6%', color: '#f97316' },
    { name: 'Processing Issue', count: 1, pct: '5.5%', color: '#eab308' },
  ];

  // Redevelopment samples
  const redevSamples = samples.filter((s) => s.redevelopmentCount > 0);

  const filteredSamples = redevSamples.filter((sample) => {
    const matchesSearch =
      sample.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.productGrade.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (reasonFilter !== 'ALL' && sample.redevelopmentReason !== reasonFilter) {
      return false;
    }

    return true;
  });

  const handleExportRedev = () => {
    const exportData = filteredSamples.map((s) => ({
      'Request ID': s.id,
      'Sales Executive': s.requestedBy,
      'Customer': s.customer,
      'Product Grade': s.productGrade,
      'Redevelopment Cycles': s.redevelopmentCount,
      'Primary Reason': s.redevelopmentReason || 'Colour Mismatch',
      'Assigned Chemist': s.assignedTo,
      'Feedback Remarks': s.customerFeedbackRemarks || 'N/A',
      'Spec Changes': s.customerRequirementChanges || 'None',
      'Current Status': s.status,
    }));
    exportToCSV(exportData, `Alok_Masterbatches_Redevelopment_RCA_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-rose-600" /> Section 10: Redevelopment Rate & Root Cause Analysis
            </h2>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
              Rate: 12.7% (Target: &lt;10.0%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: (Total Redevelopments / Total Samples Developed) × 100. Iterations remain linked to single Request ID.
          </p>
        </div>

        <button
          onClick={handleExportRedev}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Redevelopment RCA</span>
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Developed Samples
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">142</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Denominator Base</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
            Redevelopments
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1 font-mono">18</div>
          <div className="text-[10px] text-rose-500 font-semibold mt-0.5">Formulation Iterations</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Redevelopment Rate
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono">12.7%</div>
          <div className="text-[10px] text-rose-500 font-semibold mt-0.5">+2.7% Above Target</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Management Target
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">&lt; 10.0%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">SLA Benchmark</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trend Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Monthly Redevelopment Rate Trend (%)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Target &lt;10%</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRedevTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} unit="%" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="rate" name="Redevelopment Rate (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Root Cause Reason Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Root Cause Classification Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-500">18 Cycles</span>
          </div>

          <div className="space-y-2">
            {reasonStats.map((r) => (
              <div key={r.name} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-slate-800">{r.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {r.count} ({r.pct})
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: r.pct,
                      backgroundColor: r.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redevelopment Register Filter & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
        <div className="p-3 bg-slate-50/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search redevelopment samples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Filter by Reason:</span>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="p-1.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
            >
              <option value="ALL">All Reasons ({redevSamples.length})</option>
              <option value="Colour Mismatch">Colour Mismatch</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Performance Issue">Performance Issue</option>
              <option value="Customer Requirement Change">Customer Requirement Change</option>
              <option value="Processing Issue">Processing Issue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Sales Exec</th>
                <th className="p-3">Customer & Grade</th>
                <th className="p-3">Iteration Count</th>
                <th className="p-3">Redevelopment Reason</th>
                <th className="p-3">Assigned Chemist</th>
                <th className="p-3">Customer Feedback & Spec Changes</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSamples.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectSample(s)}
                  className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {s.isPriority && <Star className="w-3 h-3 fill-amber-400 text-amber-500" />}
                      <span>{s.id}</span>
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{s.requestedBy}</td>

                  <td className="p-3">
                    <div className="font-bold text-slate-900">{s.customer}</div>
                    <div className="text-[10px] text-slate-400">{s.productGrade}</div>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <RotateCcw className="w-3 h-3 text-amber-700" /> Cycle V{s.redevelopmentCount + 1}
                    </span>
                  </td>

                  <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                    {s.redevelopmentReason || 'Colour Mismatch'}
                  </td>

                  <td className="p-3 text-[11px] text-blue-700 font-medium whitespace-nowrap">
                    {s.assignedTo}
                  </td>

                  <td className="p-3 text-[11px] text-slate-600 max-w-xs truncate">
                    {s.customerFeedbackRemarks ? (
                      <span>"{s.customerFeedbackRemarks}"</span>
                    ) : (
                      <span className="text-slate-400 italic">Reformulating in progress</span>
                    )}
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSample(s);
                      }}
                      className="p-1.5 text-amber-700 hover:bg-amber-100 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
