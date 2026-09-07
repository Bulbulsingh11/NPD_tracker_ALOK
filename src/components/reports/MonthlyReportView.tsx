import React, { useState } from 'react';
import { MONTHLY_NPD_REPORTS } from '../../data/demoData';
import {
  FileBarChart,
  Download,
  Printer,
  TrendingUp,
  Calendar,
  Layers,
  Scale,
  Package,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  DollarSign,
  Globe,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle,
  XCircle,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { exportToCSV } from '../../utils/npdHelpers';

export const MonthlyReportView: React.FC = () => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0); // 0 = July 2026
  const report = MONTHLY_NPD_REPORTS[selectedMonthIndex] || MONTHLY_NPD_REPORTS[0];

  const handleExportReport = () => {
    const exportData = [
      {
        'Metric Category': 'Request Summary',
        'Metric Name': 'Total Requests',
        'Value': report.totalRequests,
        'Period': report.month,
      },
      {
        'Metric Category': 'Request Summary',
        'Metric Name': 'Sample + Price Mode',
        'Value': report.sampleAndPriceCount,
        'Period': report.month,
      },
      {
        'Metric Category': 'Request Summary',
        'Metric Name': 'Price Only Mode',
        'Value': report.priceOnlyCount,
        'Period': report.month,
      },
      {
        'Metric Category': 'Request Summary',
        'Metric Name': 'Export Samples',
        'Value': report.exportSamples,
        'Period': report.month,
      },
      {
        'Metric Category': 'Request Summary',
        'Metric Name': 'Local / Domestic Samples',
        'Value': report.localSamples,
        'Period': report.month,
      },
      {
        'Metric Category': 'Lab Performance',
        'Metric Name': 'Samples Requiring Dev',
        'Value': report.totalSamplesAssigned,
        'Period': report.month,
      },
      {
        'Metric Category': 'Lab Performance',
        'Metric Name': 'Developed Samples',
        'Value': report.totalDeveloped,
        'Period': report.month,
      },
      {
        'Metric Category': 'Lab Performance',
        'Metric Name': 'Pending in Lab',
        'Value': report.pendingDevelopment,
        'Period': report.month,
      },
      {
        'Metric Category': 'Lab Performance',
        'Metric Name': 'Average Lab Dev TAT (Days)',
        'Value': report.averageLabTatDays,
        'Period': report.month,
      },
      {
        'Metric Category': 'Post-Sample Performance',
        'Metric Name': 'Customer Feedback Pending',
        'Value': report.feedbackPendingCount,
        'Period': report.month,
      },
      {
        'Metric Category': 'Customer Outcomes',
        'Metric Name': 'Approved Samples',
        'Value': report.approvedCount,
        'Period': report.month,
      },
      {
        'Metric Category': 'Customer Outcomes',
        'Metric Name': 'Redevelopment Required',
        'Value': report.redevelopmentCount,
        'Period': report.month,
      },
      {
        'Metric Category': 'Customer Outcomes',
        'Metric Name': 'Rejected',
        'Value': report.rejectedCount,
        'Period': report.month,
      },
      {
        'Metric Category': 'Redevelopment',
        'Metric Name': 'Redevelopment Rate (%)',
        'Value': `${report.redevelopmentRatePct}%`,
        'Period': report.month,
      },
      {
        'Metric Category': 'Dispatched Material',
        'Metric Name': 'Sample Quantity Sent (KG)',
        'Value': report.sampleQuantityKg,
        'Period': report.month,
      },
    ];

    exportToCSV(exportData, `Alok_Masterbatches_NPD_Report_${report.month.replace(' ', '_')}`);
  };

  const outcomePieData = [
    { name: 'Approved', value: report.approvedCount, color: '#10b981' },
    { name: 'Redevelopment', value: report.redevelopmentCount, color: '#f59e0b' },
    { name: 'Rejected', value: report.rejectedCount, color: '#ef4444' },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Month Selector & Export */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileBarChart className="w-4 h-4 text-blue-600" /> Section 13: Monthly NPD Management Report
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
              {report.month}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive reconciliation of request volume, lab turnaround, customer trials, and redevelopment rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month Tabs */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            {MONTHLY_NPD_REPORTS.map((m, idx) => (
              <button
                key={m.month}
                onClick={() => setSelectedMonthIndex(idx)}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedMonthIndex === idx
                    ? 'bg-white text-blue-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.month.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid of Report Modules (Sections A to F) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* SECTION A: Total Request Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" /> A. Request Volume Summary
            </h3>
            <span className="font-mono font-bold text-slate-900 text-sm">{report.totalRequests} Total</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-blue-50/60 rounded border border-blue-100">
              <span className="font-medium text-blue-900 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" /> Sample + Price (Lab Scope)
              </span>
              <span className="font-mono font-bold text-blue-800">{report.sampleAndPriceCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-amber-50/60 rounded border border-amber-100">
              <span className="font-medium text-amber-900 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Price Only (Quote Scope)
              </span>
              <span className="font-mono font-bold text-amber-800">{report.priceOnlyCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" /> Export Samples
              </span>
              <span className="font-mono font-bold text-slate-800">{report.exportSamples}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Local / Domestic Samples
              </span>
              <span className="font-mono font-bold text-slate-800">{report.localSamples}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Existing-Grade Additional Requests</span>
              <span className="font-mono font-bold text-slate-800">{report.additionalExistingGradeRequests}</span>
            </div>
          </div>
        </div>

        {/* SECTION B: Lab Performance & TAT */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-600" /> B. Lab Performance & TAT
            </h3>
            <span className="font-mono font-bold text-emerald-700 text-sm">{report.averageLabTatDays}d Avg</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Samples Requiring Development</span>
              <span className="font-mono font-bold text-slate-900">{report.totalSamplesAssigned}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-emerald-50/60 rounded border border-emerald-100">
              <span className="font-medium text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Developed Samples
              </span>
              <span className="font-mono font-bold text-emerald-800">{report.totalDeveloped}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-orange-50/60 rounded border border-orange-100">
              <span className="font-medium text-orange-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" /> Pending in Lab
              </span>
              <span className="font-mono font-bold text-orange-800">{report.pendingDevelopment}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Target Development TAT</span>
              <span className="font-mono font-bold text-slate-800">7.0 Days</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-emerald-50 rounded border border-emerald-200">
              <span className="font-medium text-emerald-900">Lab TAT Compliance Rate</span>
              <span className="font-mono font-bold text-emerald-800">{report.tatCompliancePct}%</span>
            </div>
          </div>
        </div>

        {/* SECTION C: Post-Sample Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" /> C. Post-Sample & Trials
            </h3>
            <span className="font-mono font-bold text-purple-700 text-sm">{report.averagePostSampleTatDays}d TAT</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Total Samples Sent / Dispatched</span>
              <span className="font-mono font-bold text-slate-900">{report.totalDeveloped}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-emerald-50/60 rounded border border-emerald-100">
              <span className="font-medium text-emerald-900">Customer Trials Completed</span>
              <span className="font-mono font-bold text-emerald-800">{report.totalDeveloped - report.feedbackPendingCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-purple-50/60 rounded border border-purple-200">
              <span className="font-medium text-purple-900 font-bold">Feedback Awaiting (Sales Exec)</span>
              <span className="font-mono font-bold text-purple-800">{report.feedbackPendingCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Avg Post-Sample TAT</span>
              <span className="font-mono font-bold text-slate-800">{report.averagePostSampleTatDays} Days</span>
            </div>

            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-500">
              Post-sample duration includes sample transit, customer plant trial scheduling, and technical feedback receipt.
            </div>
          </div>
        </div>

        {/* SECTION D: Customer Trial Outcomes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> D. Customer Trial Outcomes
            </h3>
            <span className="font-mono font-bold text-emerald-700 text-xs">
              {((report.approvedCount / (report.approvedCount + report.redevelopmentCount + report.rejectedCount)) * 100).toFixed(1)}% Approval
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Approved</div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{report.approvedCount}</div>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-[10px] font-bold text-amber-800 uppercase">Redev. Req.</div>
              <div className="text-xl font-bold font-mono text-amber-700 mt-1">{report.redevelopmentCount}</div>
            </div>

            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="text-[10px] font-bold text-rose-800 uppercase">Rejected</div>
              <div className="text-xl font-bold font-mono text-rose-700 mt-1">{report.rejectedCount}</div>
            </div>
          </div>

          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {outcomePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION E: Redevelopment Metrics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-rose-600" /> E. Redevelopment Metrics
            </h3>
            <span className="font-mono font-bold text-rose-700 text-sm">{report.redevelopmentRatePct}% Rate</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Total Redevelopments</span>
              <span className="font-mono font-bold text-rose-700">{report.totalRedevelopments} Iterations</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-700">Avg Redevelopment TAT</span>
              <span className="font-mono font-bold text-slate-800">{report.averageRedevelopmentTatDays} Days</span>
            </div>

            <div className="p-2 bg-rose-50/70 border border-rose-100 rounded text-xs space-y-1">
              <div className="font-bold text-rose-900 text-[11px]">Primary Root Causes:</div>
              <div className="flex justify-between text-rose-800 text-[10px]">
                <span>• Colour / Shade Mismatch:</span>
                <span className="font-mono font-bold">11 (61%)</span>
              </div>
              <div className="flex justify-between text-rose-800 text-[10px]">
                <span>• Mechanical / Quality Issue:</span>
                <span className="font-mono font-bold">3 (17%)</span>
              </div>
              <div className="flex justify-between text-rose-800 text-[10px]">
                <span>• Dispersion / Performance:</span>
                <span className="font-mono font-bold">2 (11%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION F: Sample Material Volume */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-cyan-600" /> F. Sample Material Sent (KG)
            </h3>
            <span className="font-mono font-bold text-cyan-800 text-sm">{report.sampleQuantityKg} KG</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-lg text-center">
              <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">
                Total Pilot Batch Weight Dispatched
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-900 mt-1">
                {report.sampleQuantityKg} KG
              </div>
              <div className="text-[10px] text-cyan-700 mt-0.5">Dispatched to Customer R&D Plants</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Export Sample Qty</span>
                <span className="font-mono font-bold text-slate-800">88.5 KG</span>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Domestic Qty</span>
                <span className="font-mono font-bold text-slate-800">
                  {(report.sampleQuantityKg - 88.5).toFixed(1)} KG
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
