import React from 'react';
import { NPDSample } from '../../types/npd';
import { MONTHLY_NPD_REPORTS, DEMO_CHEMIST_PERFORMANCE } from '../../data/demoData';
import {
  TrendingUp,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Zap,
  ArrowUpRight,
  FlaskConical,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  Star,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  getStatusBadgeStyle,
  getRequirementModeBadge,
  getRequestTypeBadge,
  formatDate,
  getCalculatedDevTat,
  getCalculatedPostSampleTat,
  getCalculatedFeedbackPendingDays,
} from '../../utils/npdHelpers';

interface ExecutiveDashboardProps {
  samples: NPDSample[];
  onSelectSample: (sample: NPDSample) => void;
  onOpenNewSampleModal?: () => void;
  onNavigate?: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  samples,
  onSelectSample,
  onOpenNewSampleModal,
  onNavigate,
}) => {
  const currentReport = MONTHLY_NPD_REPORTS[0]; // July 2026

  // Recent 6 samples
  const recentSamples = samples.slice(0, 6);

  // Monthly Trend Chart Data
  const monthlyTrendData = [
    { month: 'Apr', total: 195, samplePrice: 150, priceOnly: 45, developed: 138 },
    { month: 'May', total: 182, samplePrice: 141, priceOnly: 41, developed: 131 },
    { month: 'Jun', total: 168, samplePrice: 130, priceOnly: 38, developed: 122 },
    { month: 'Jul', total: 198, samplePrice: 152, priceOnly: 46, developed: 142 },
  ];

  // TAT Trend Data
  const tatTrendData = [
    { month: 'Apr', labTat: 5.0, postTat: 7.2, target: 7.0 },
    { month: 'May', labTat: 5.1, postTat: 7.8, target: 7.0 },
    { month: 'Jun', labTat: 4.6, postTat: 6.9, target: 7.0 },
    { month: 'Jul', labTat: 4.8, postTat: 7.4, target: 7.0 },
  ];

  // Feedback Aging Data
  const feedbackAgingData = [
    { bucket: '1 - 7 Days (Normal)', count: 24, fill: '#10b981' },
    { bucket: '8 - 14 Days (Warning)', count: 12, fill: '#f59e0b' },
    { bucket: '> 14 Days (Critical Aging)', count: 6, fill: '#ef4444' },
  ];

  // Redevelopment Reasons Breakdown
  const redevReasonData = [
    { name: 'Colour Mismatch', value: 11, color: '#3b82f6' },
    { name: 'Quality Issue', value: 3, color: '#8b5cf6' },
    { name: 'Performance Issue', value: 2, color: '#ec4899' },
    { name: 'Spec Change', value: 1, color: '#f97316' },
    { name: 'Processing Issue', value: 1, color: '#eab308' },
  ];

  return (
    <div className="space-y-4">
      {/* Top 9 Management KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
        {/* 1. Total Requests */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Requests
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {currentReport.totalRequests}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">July 2026 Active</div>
        </div>

        {/* 2. Sample + Price */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <FlaskConical className="w-3 h-3" /> Sample + Price
          </div>
          <div className="text-xl font-bold text-blue-700 mt-1 font-mono">
            {currentReport.sampleAndPriceCount}
          </div>
          <div className="text-[10px] text-blue-600/80 mt-0.5">Lab Pipeline (76.8%)</div>
        </div>

        {/* 3. Price Only */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Price Only
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1 font-mono">
            {currentReport.priceOnlyCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Non-Lab Quotes</div>
        </div>

        {/* 4. Pending Lab */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
            Pending Lab
          </div>
          <div className="text-xl font-bold text-orange-600 mt-1 font-mono">
            {currentReport.pendingDevelopment}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">In Formulation</div>
        </div>

        {/* 5. Developed */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Developed
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1 font-mono">
            {currentReport.totalDeveloped}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {((currentReport.totalDeveloped / currentReport.totalSamplesAssigned) * 100).toFixed(1)}% Comp.
          </div>
        </div>

        {/* 6. Feedback Pending */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            Feedback Pending
          </div>
          <div className="text-xl font-bold text-purple-700 mt-1 font-mono">
            {currentReport.feedbackPendingCount}
          </div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Action: Sales Exec</div>
        </div>

        {/* 7. Redevelopment */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
            Redevelopment
          </div>
          <div className="text-xl font-bold text-rose-600 mt-1 font-mono">
            {currentReport.totalRedevelopments}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{currentReport.redevelopmentRatePct}% Rate</div>
        </div>

        {/* 8. Avg Lab TAT */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Avg Lab TAT
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {currentReport.averageLabTatDays}d
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Within 7d Target</div>
        </div>

        {/* 9. Avg Post-Sample TAT */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Post-Sample TAT
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {currentReport.averagePostSampleTatDays}d
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Trial to Feedback</div>
        </div>
      </div>

      {/* Main Grid: Charts and Operational Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Interactive Visuals & Recent Activity */}
        <div className="lg:col-span-8 space-y-4">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Volume Trend */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Monthly Request & Dev. Volume
                  </h3>
                  <span className="text-[10px] text-slate-400">Apr – Jul 2026 Breakdown</span>
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="samplePrice" name="Sample + Price" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="priceOnly" name="Price Only" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="developed" name="Developed" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TAT Trend (Lab vs Post-Sample vs SLA) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    TAT Compliance Trend (Days)
                  </h3>
                  <span className="text-[10px] text-slate-400">Lab Dev TAT vs Post-Sample TAT</span>
                </div>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tatTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 10]} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="labTat" name="Lab TAT (Days)" stroke="#2563eb" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="postTat" name="Post-Sample TAT" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" name="Target (7d SLA)" stroke="#ef4444" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Active Samples Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active NPD Sample Requests
                </h3>
                <span className="text-[10px] text-slate-400">Showing latest multi-stage records</span>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                View Full Register <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-y border-slate-100 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Sales Exec</th>
                    <th className="p-2.5">Customer & Grade</th>
                    <th className="p-2.5">Mode</th>
                    <th className="p-2.5">Assigned To</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Dev TAT</th>
                    <th className="p-2.5">Post TAT</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSamples.map((s) => {
                    const statusStyle = getStatusBadgeStyle(s.status);
                    const modeBadge = getRequirementModeBadge(s.requirementMode);
                    const devTat = getCalculatedDevTat(s);
                    const postTat = getCalculatedPostSampleTat(s);
                    const pendingFeedbackDays = getCalculatedFeedbackPendingDays(s);

                    return (
                      <tr
                        key={s.id}
                        onClick={() => onSelectSample(s)}
                        className="hover:bg-blue-50/60 cursor-pointer transition-colors"
                      >
                        <td className="p-2.5 font-mono font-bold text-blue-600 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {s.isPriority && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />}
                            <span>{s.id}</span>
                          </div>
                        </td>
                        <td className="p-2.5 font-medium text-slate-700 whitespace-nowrap">{s.requestedBy}</td>
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-900">{s.customer}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{s.productGrade}</div>
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${modeBadge.bg}`}>
                            {modeBadge.label}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-700 whitespace-nowrap">
                          {s.assignedTo.split('(')[0]}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusStyle.bg}`}>
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono whitespace-nowrap font-bold text-[11px]">
                          {s.requirementMode === 'PRICE ONLY' ? (
                            <span className="text-slate-400">N/A</span>
                          ) : devTat !== undefined ? (
                            <span className={devTat > 7 ? 'text-rose-600' : 'text-emerald-700'}>{devTat}d</span>
                          ) : (
                            <span className="text-slate-400">In Lab</span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono whitespace-nowrap font-bold text-[11px]">
                          {s.requirementMode === 'PRICE ONLY' ? (
                            <span className="text-slate-400">N/A</span>
                          ) : postTat !== undefined ? (
                            <span>{postTat}d</span>
                          ) : pendingFeedbackDays !== undefined ? (
                            <span className="text-amber-600 font-bold text-[10px]">
                              Pending ({pendingFeedbackDays}d)
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSample(s);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          >
                            <Eye className="w-3.5 h-3.5" />
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

        {/* Right Column (4 cols): Lab Efficiency & Root Cause */}
        <div className="lg:col-span-4 space-y-4">
          {/* Lab Chemist Workload & Efficiency */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Lab Chemist Efficiency
                </h3>
                <span className="text-[10px] text-slate-400">Assigned vs Completed vs TAT</span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('insights')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Details
              </button>
            </div>

            <div className="space-y-2.5">
              {DEMO_CHEMIST_PERFORMANCE.map((c) => (
                <div key={c.employeeName} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate pr-2">{c.employeeName.split('(')[0]}</span>
                    <span className="font-mono text-blue-700 shrink-0">{c.avgDevTatDays}d Avg TAT</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>
                      {c.assignedCount} Assigned • <strong className="text-emerald-700">{c.completedCount} Done</strong> •{' '}
                      <strong className="text-orange-700">{c.pendingCount} Pending</strong>
                    </span>
                    <span className="font-semibold text-slate-700">{c.tatCompliancePct}% SLA</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(c.completedCount / c.assignedCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Pending Aging Alert Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" /> Feedback Pending Aging
              </h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                42 Pending
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Days elapsed since sample dispatch without Sales Executive customer feedback entry.
            </p>

            <div className="space-y-2">
              {feedbackAgingData.map((b) => (
                <div key={b.bucket} className="flex items-center justify-between p-2 rounded border border-slate-100 bg-slate-50 text-xs">
                  <span className="font-medium text-slate-700">{b.bucket}</span>
                  <span className="font-mono font-bold text-slate-900">{b.count} Samples</span>
                </div>
              ))}
            </div>
          </div>

          {/* Redevelopment Root Cause Pie */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-500" /> Redevelopment Root Causes
              </h3>
              <span className="text-[10px] font-bold text-slate-500">18 Cycles</span>
            </div>

            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={redevReasonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {redevReasonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
              {redevReasonData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
