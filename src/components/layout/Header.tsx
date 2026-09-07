import React from 'react';
import { Search, Plus, Bell, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  activeView?: string;
  onSearch?: (query: string) => void;
  onOpenNewSampleModal?: () => void;
  selectedMonth?: string;
  onSelectMonth?: (month: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView = 'dashboard',
  onSearch,
  onOpenNewSampleModal,
  selectedMonth = 'July 2026',
}) => {
  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Executive NPD Dashboard';
      case 'register':
        return 'NPD Sample Request Register';
      case 'tat':
      case 'efficiency':
        return 'Lab Efficiency & TAT Monitoring';
      case 'feedback':
        return 'Sales Executive Customer Feedback Module';
      case 'redevelopment':
        return 'Redevelopment & Root Cause Analytics';
      case 'reports':
        return 'Monthly NPD Management Performance Report';
      case 'insights':
        return 'Lab Efficiency & Workload Intelligence';
      case 'workflow':
        return 'End-to-End NPD Process & SOP Flow';
      case 'settings':
        return 'SLA Configuration & Target Settings';
      default:
        return 'NPD Management Dashboard';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center space-x-3 min-w-0">
        <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
          {getTitle()}
        </h1>
        <span className="hidden sm:inline-block bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
          PROTOTYPE V2.0 • DEMO DATA
        </span>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Search */}
        {onSearch && (
          <div className="hidden md:flex items-center relative w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Request ID, customer, grade..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            />
          </div>
        )}

        <div className="text-xs text-slate-500 hidden sm:block shrink-0">
          Period: <span className="font-bold text-slate-700">{selectedMonth}</span>
        </div>

        {/* Action Button */}
        {onOpenNewSampleModal && (
          <button
            onClick={onOpenNewSampleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Request</span>
          </button>
        )}
      </div>
    </header>
  );
};
