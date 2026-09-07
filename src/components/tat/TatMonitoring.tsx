import React, { useState } from 'react';
import { NPDSample, TATTargets } from '../../types/npd';
import { DEMO_CHEMIST_PERFORMANCE, MONTHLY_NPD_REPORTS } from '../../data/demoData';
import {
  Clock,
  FlaskConical,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sliders,
  CheckCircle,
  AlertCircle,
  Eye,
  Star,
  Users,
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
  LineChart,
  Line,
} from 'recharts';
import {
  formatDate,
  getStatusBadgeStyle,
  getRequirementModeBadge,
  getCalculatedDevTat,
} from '../../utils/npdHelpers';

interface TatMonitoringProps {
  samples: NPDSample[];
  targets: TATTargets;
  onUpdateTargets: (targets: TATTargets) => void;
  onSelectSample: (sample: NPDSample) => void;
}

export const TatMonitoring: React.FC<TatMonitoringProps> = ({
  samples,
  targets,
  onUpdateTargets,
  onSelectSample,
}) => {
  const currentReport = MONTHLY_NPD_REPORTS[0]; // July 2026
  const [targetDevDays, setTargetDevDays] = useState(targets.developmentDays);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Filter samples requiring lab development (exclude Price Only)
  const labSamples = samples.filter((s) => s.requirementMode === 'SAMPLE + PRICE');
  const delayedSamples = labSamples.filter((s) => {
    const devTat = getCalculatedDevTat(s);
    return (devTat !== undefined && devTat > targets.developmentDays) || s.isTatBreached;
  });

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTargets({
      ...targets,
      developmentDays: Number(targetDevDays),
    });
    setIsConfiguring(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-blue-600" /> Lab Development Efficiency & TAT Monitoring
            </h2>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
              Avg TAT: {currentReport.averageLabTatDays} Days (Target: {targets.developmentDays}d)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-calculated Turnaround Time (Request Date → Development Completed Date) and chemist-wise efficiency.
          </p>
        </div>

        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold border border-slate-200 self-start md:self-auto transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Config Target SLA ({targets.developmentDays}d)</span>
        </button>
      </div>

      {/* Target Configuration Panel */}
      {isConfiguring && (
        <form onSubmit={handleSaveTarget} className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900">Configure Standard Target Development SLA</span>
            <button
              type="button"
              onClick={() => setIsConfiguring(false)}
              className="text-blue-700 hover:underline text-[11px]"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-slate-700 font-medium">Target Development TAT (Days):</label>
            <input
              type="number"
              min="1"
              max="30"
              value={targetDevDays}
              onChange={(e) => setTargetDevDays(Number(e.target.value))}
              className="w-20 p-1.5 border border-slate-300 rounded bg-white font-mono font-bold"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
            >
              Save SLA
            </button>
          </div>
        </form>
      )}

      {/* Section 11 KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Sample Requests
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {currentReport.sampleAndPriceCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sample + Price Mode</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            Requiring Dev
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1 font-mono">
            {currentReport.totalSamplesAssigned}
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">Assigned to Chemist</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            Samples Developed
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {currentReport.totalDeveloped}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {currentReport.pendingDevelopment} Still in Lab
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Average Dev TAT
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {currentReport.averageLabTatDays}d
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            vs {targets.developmentDays}d Target
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            TAT Compliance %
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {currentReport.tatCompliancePct}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Within SLA Window</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
            Delayed Samples
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1 font-mono">
            {currentReport.delayedSamplesCount}
          </div>
          <div className="text-[10px] text-rose-500 font-medium mt-0.5">&gt; {targets.developmentDays} Days</div>
        </div>
      </div>

      {/* Section 11: Employee-Wise Lab Efficiency Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Lab Chemist Performance & Workload Matrix
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Workload distribution, completion rates, average development TAT, and SLA compliance.
            </p>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            5 Active Chemists
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Lab Employee / Chemist</th>
                <th className="p-3 text-center">Assigned</th>
                <th className="p-3 text-center">Completed</th>
                <th className="p-3 text-center">Pending</th>
                <th className="p-3 text-center">Avg Dev. TAT</th>
                <th className="p-3 text-center">TAT Compliance %</th>
                <th className="p-3 text-center">Redevelopments</th>
                <th className="p-3">Efficiency Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DEMO_CHEMIST_PERFORMANCE.map((c) => (
                <tr key={c.employeeName} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">
                    <div>{c.employeeName.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {c.employeeName.split('(')[1]?.replace(')', '')}
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-slate-800">{c.assignedCount}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-700">{c.completedCount}</td>
                  <td className="p-3 text-center font-mono font-bold text-orange-600">{c.pendingCount}</td>
                  <td className="p-3 text-center font-mono font-bold text-blue-700">{c.avgDevTatDays} Days</td>
                  <td className="p-3 text-center font-mono font-bold text-slate-800">{c.tatCompliancePct}%</td>
                  <td className="p-3 text-center font-mono text-amber-700">{c.redevelopmentsCount}</td>
                  <td className="p-3">
                    <div className="w-36">
                      <div className="flex items-center justify-between text-[10px] mb-1 font-semibold">
                        <span className="text-slate-600">
                          {((c.completedCount / c.assignedCount) * 100).toFixed(0)}% Done
                        </span>
                        <span className={c.tatCompliancePct > 90 ? 'text-emerald-600' : 'text-amber-600'}>
                          {c.tatCompliancePct > 90 ? 'High' : 'Moderate'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.tatCompliancePct > 90 ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${c.tatCompliancePct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delayed Samples Exception Queue */}
      {delayedSamples.length > 0 && (
        <div className="bg-white rounded-xl border border-rose-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-rose-50/70 border-b border-rose-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Delayed Samples Exceeding Development SLA ({delayedSamples.length})
              </h3>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Samples requiring management intervention or priority pilot line rescheduling.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
              SLA Breached
            </span>
          </div>

          <div className="divide-y divide-rose-100">
            {delayedSamples.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSample(s)}
                className="p-3 flex items-center justify-between hover:bg-rose-50/40 cursor-pointer transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {s.id}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{s.productGrade}</span>
                    <span className="text-slate-500 text-[11px] ml-2">({s.customer})</span>
                    <div className="text-[10px] text-slate-400">Assigned to: {s.assignedTo}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600 text-xs">
                      {getCalculatedDevTat(s)} Days (Delayed)
                    </span>
                    <div className="text-[10px] text-slate-400">Target: {targets.developmentDays}d</div>
                  </div>

                  <button className="p-1.5 text-rose-600 hover:bg-rose-100 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
