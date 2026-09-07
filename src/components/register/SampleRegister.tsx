import React, { useState, useMemo } from 'react';
import {
  NPDSample,
  NPDStatus,
  RequestType,
  RequirementMode,
} from '../../types/npd';
import { LAB_CHEMISTS, SALES_EXECUTIVES } from '../../data/demoData';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Eye,
  DollarSign,
  FlaskConical,
  Star,
  Layers,
} from 'lucide-react';
import {
  getStatusBadgeStyle,
  getRequirementModeBadge,
  getRequestTypeBadge,
  formatDate,
  getCalculatedDevTat,
  getCalculatedPostSampleTat,
  getCalculatedFeedbackPendingDays,
} from '../../utils/npdHelpers';

interface SampleRegisterProps {
  samples: NPDSample[];
  onSelectSample: (sample: NPDSample) => void;
  onOpenNewSampleModal: () => void;
}

type SortField =
  | 'id'
  | 'requestDate'
  | 'customer'
  | 'productGrade'
  | 'status'
  | 'tatDevelopment'
  | 'tatPostSample'
  | 'redevelopmentCount';
type SortOrder = 'asc' | 'desc';

export const SampleRegister: React.FC<SampleRegisterProps> = ({
  samples,
  onSelectSample,
  onOpenNewSampleModal,
}) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'SAMPLE_PRICE' | 'PRICE_ONLY' | 'PENDING_LAB' | 'FEEDBACK_PENDING' | 'REDEVELOPMENT'>('ALL');
  const [salesExecFilter, setSalesExecFilter] = useState<string>('ALL');
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');
  const [requestTypeFilter, setRequestTypeFilter] = useState<string>('ALL');
  const [requirementModeFilter, setRequirementModeFilter] = useState<string>('ALL');
  const [labEmployeeFilter, setLabEmployeeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('requestDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Unique customers for dropdown
  const uniqueCustomers = useMemo(() => {
    return Array.from(new Set(samples.map((s) => s.customer))).sort();
  }, [samples]);

  // Filtered and sorted data
  const filteredSamples = useMemo(() => {
    return samples
      .filter((sample) => {
        // Quick Tabs
        if (activeTab === 'SAMPLE_PRICE' && sample.requirementMode !== 'SAMPLE + PRICE') return false;
        if (activeTab === 'PRICE_ONLY' && sample.requirementMode !== 'PRICE ONLY') return false;
        if (activeTab === 'PENDING_LAB' && !(sample.status === 'PENDING ASSIGNMENT' || sample.status === 'IN DEVELOPMENT')) return false;
        if (activeTab === 'FEEDBACK_PENDING' && sample.status !== 'FEEDBACK PENDING') return false;
        if (activeTab === 'REDEVELOPMENT' && sample.redevelopmentCount === 0 && sample.status !== 'REDEVELOPMENT REQUIRED') return false;

        // Search term matching: Request ID, Customer, Grade, Sales Executive
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !term ||
          sample.id.toLowerCase().includes(term) ||
          sample.customer.toLowerCase().includes(term) ||
          sample.productGrade.toLowerCase().includes(term) ||
          sample.requestedBy.toLowerCase().includes(term) ||
          sample.assignedTo.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        // Sales Exec filter
        if (salesExecFilter !== 'ALL' && sample.requestedBy !== salesExecFilter) return false;

        // Customer filter
        if (customerFilter !== 'ALL' && sample.customer !== customerFilter) return false;

        // Request Type filter
        if (requestTypeFilter !== 'ALL' && sample.requestType !== requestTypeFilter) return false;

        // Requirement Mode filter
        if (requirementModeFilter !== 'ALL' && sample.requirementMode !== requirementModeFilter) return false;

        // Lab Employee filter
        if (labEmployeeFilter !== 'ALL' && !sample.assignedTo.includes(labEmployeeFilter)) return false;

        // Status filter
        if (statusFilter !== 'ALL' && sample.status !== statusFilter) return false;

        // Date range filter
        if (startDate && new Date(sample.requestDate) < new Date(startDate)) return false;
        if (endDate && new Date(sample.requestDate) > new Date(endDate)) return false;

        return true;
      })
      .sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        if (sortField === 'requestDate') {
          aVal = new Date(a.requestDate).getTime();
          bVal = new Date(b.requestDate).getTime();
        }

        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
      });
  }, [
    samples,
    activeTab,
    searchTerm,
    salesExecFilter,
    customerFilter,
    requestTypeFilter,
    requirementModeFilter,
    labEmployeeFilter,
    statusFilter,
    startDate,
    endDate,
    sortField,
    sortOrder,
  ]);

  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Request Date',
      'Sales Executive',
      'Customer',
      'Location',
      'Product / Grade',
      'Request Type',
      'Requirement Mode',
      'Assigned Lab Employee',
      'Status',
      'Dev TAT (Days)',
      'Post-Sample TAT (Days)',
      'Feedback Pending Days',
      'Trial Result',
      'Redevelopments',
    ];

    const rows = filteredSamples.map((s) => [
      s.id,
      s.requestDate,
      s.requestedBy,
      s.customer,
      s.customerLocation,
      s.productGrade,
      s.requestType,
      s.requirementMode,
      s.assignedTo,
      s.status,
      getCalculatedDevTat(s) ?? 'N/A',
      getCalculatedPostSampleTat(s) ?? 'N/A',
      getCalculatedFeedbackPendingDays(s) ?? 'N/A',
      s.trialResult ?? 'Pending',
      s.redevelopmentCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Alok_NPD_Sample_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              NPD Sample Request Register
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
              {filteredSamples.length} of {samples.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Master multi-stage tracking register from Sales request to Lab development, dispatch & commercial closure.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewSampleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold select-none">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'SAMPLE_PRICE', label: 'Sample + Price (Lab Pipeline)' },
          { id: 'PRICE_ONLY', label: 'Price Only' },
          { id: 'PENDING_LAB', label: 'Pending Lab / In Dev' },
          { id: 'FEEDBACK_PENDING', label: 'Feedback Pending (Sales Action)' },
          { id: 'REDEVELOPMENT', label: 'Redevelopment Cycles' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comprehensive Filter & Search Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Request ID (e.g. NPD-2026-08-001), Customer, Grade, or Sales Executive..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {(searchTerm ||
            salesExecFilter !== 'ALL' ||
            customerFilter !== 'ALL' ||
            requestTypeFilter !== 'ALL' ||
            requirementModeFilter !== 'ALL' ||
            labEmployeeFilter !== 'ALL' ||
            statusFilter !== 'ALL' ||
            startDate ||
            endDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSalesExecFilter('ALL');
                setCustomerFilter('ALL');
                setRequestTypeFilter('ALL');
                setRequirementModeFilter('ALL');
                setLabEmployeeFilter('ALL');
                setStatusFilter('ALL');
                setStartDate('');
                setEndDate('');
                setActiveTab('ALL');
              }}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Granular Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* Sales Executive */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Sales Executive
            </label>
            <select
              value={salesExecFilter}
              onChange={(e) => setSalesExecFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-1.5 bg-slate-50 text-slate-700 outline-none text-xs"
            >
              <option value="ALL">All Sales Execs</option>
              {SALES_EXECUTIVES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Customer
            </label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-1.5 bg-slate-50 text-slate-700 outline-none text-xs"
            >
              <option value="ALL">All Customers</option>
              {uniqueCustomers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Request Type */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Request Type
            </label>
            <select
              value={requestTypeFilter}
              onChange={(e) => setRequestTypeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-1.5 bg-slate-50 text-slate-700 outline-none text-xs"
            >
              <option value="ALL">All Types</option>
              <option value="New Development">New Development</option>
              <option value="Redevelopment">Redevelopment</option>
              <option value="Existing Grade">Existing Grade</option>
            </select>
          </div>

          {/* Requirement Mode */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Requirement Mode
            </label>
            <select
              value={requirementModeFilter}
              onChange={(e) => setRequirementModeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-1.5 bg-slate-50 text-slate-700 outline-none text-xs"
            >
              <option value="ALL">All Modes</option>
              <option value="SAMPLE + PRICE">Sample + Price</option>
              <option value="PRICE ONLY">Price Only</option>
            </select>
          </div>

          {/* Lab Employee */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Lab Chemist
            </label>
            <select
              value={labEmployeeFilter}
              onChange={(e) => setLabEmployeeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-1.5 bg-slate-50 text-slate-700 outline-none text-xs"
            >
              <option value="ALL">All Lab Chemists</option>
              {LAB_CHEMISTS.map((c) => (
                <option key={c} value={c.split(' ')[0]}>
                  {c.split(' ')[0]} {c.split(' ')[1]}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Current Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-1.5 bg-slate-50 text-slate-700 outline-none text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUEST RECEIVED">Request Received</option>
              <option value="PENDING ASSIGNMENT">Pending Lab Assign.</option>
              <option value="IN DEVELOPMENT">In Development</option>
              <option value="DEVELOPMENT COMPLETED">Dev. Completed</option>
              <option value="SAMPLE / PRICE SHARED">Sample Dispatched</option>
              <option value="FEEDBACK PENDING">Feedback Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REDEVELOPMENT REQUIRED">Redevelopment Req.</option>
              <option value="REJECTED">Rejected</option>
              <option value="PRICE PREPARATION">Price Preparation</option>
              <option value="PRICE SHARED">Price Shared</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Request ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('requestDate')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">Sales Exec</th>
                <th
                  onClick={() => handleSort('customer')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('productGrade')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Product / Grade</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">Req. Type</th>
                <th className="p-3 whitespace-nowrap">Mode</th>
                <th className="p-3 whitespace-nowrap">Assigned Lab Chemist</th>
                <th
                  onClick={() => handleSort('status')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">Dev. TAT</th>
                <th className="p-3 whitespace-nowrap">Post-Sample TAT</th>
                <th className="p-3 whitespace-nowrap">Outcome</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-slate-400">
                    No sample requests found matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => {
                  const statusStyle = getStatusBadgeStyle(sample.status);
                  const modeBadge = getRequirementModeBadge(sample.requirementMode);
                  const typeBadge = getRequestTypeBadge(sample.requestType);
                  const devTat = getCalculatedDevTat(sample);
                  const postTat = getCalculatedPostSampleTat(sample);
                  const feedbackPendingDays = getCalculatedFeedbackPendingDays(sample);

                  return (
                    <tr
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className="hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      {/* Request ID */}
                      <td className="p-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {sample.isPriority && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" title="High Priority Fast-Track" />
                          )}
                          <span>{sample.id}</span>
                        </div>
                      </td>

                      {/* Request Date */}
                      <td className="p-3 text-slate-500 whitespace-nowrap font-mono">
                        {formatDate(sample.requestDate)}
                      </td>

                      {/* Sales Exec */}
                      <td className="p-3 font-medium text-slate-800 whitespace-nowrap">
                        {sample.requestedBy}
                      </td>

                      {/* Customer */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{sample.customer}</div>
                        <div className="text-[10px] text-slate-400">{sample.customerLocation}</div>
                      </td>

                      {/* Product Grade */}
                      <td className="p-3">
                        <div className="font-medium text-slate-800 line-clamp-1">
                          {sample.productGrade}
                        </div>
                        <div className="text-[10px] text-slate-400">{sample.category}</div>
                      </td>

                      {/* Request Type */}
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${typeBadge.bg}`}>
                          {typeBadge.label}
                        </span>
                      </td>

                      {/* Requirement Mode */}
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${modeBadge.bg}`}>
                          {modeBadge.label}
                        </span>
                      </td>

                      {/* Assigned Lab Employee */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {sample.assignedTo.split('(')[0]}
                        </div>
                        {sample.assignedTo.includes('(') && (
                          <div className="text-[9px] text-slate-400">
                            {sample.assignedTo.split('(')[1]?.replace(')', '')}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>

                      {/* Development TAT */}
                      <td className="p-3 whitespace-nowrap font-mono">
                        {sample.requirementMode === 'PRICE ONLY' ? (
                          <span className="text-slate-400 text-[10px]">N/A (Price)</span>
                        ) : devTat !== undefined ? (
                          <div className="flex items-center gap-1">
                            <span className={`font-bold ${devTat > 7 ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {devTat}d
                            </span>
                            {devTat > 7 ? (
                              <span className="text-[9px] text-rose-500 font-bold bg-rose-50 px-1 rounded">
                                Breached
                              </span>
                            ) : (
                              <span className="text-[9px] text-emerald-600 font-semibold">
                                ✓ Target
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">In Lab</span>
                        )}
                      </td>

                      {/* Post-Sample TAT */}
                      <td className="p-3 whitespace-nowrap font-mono">
                        {sample.requirementMode === 'PRICE ONLY' ? (
                          <span className="text-slate-400 text-[10px]">N/A (Price)</span>
                        ) : postTat !== undefined ? (
                          <span className="font-bold text-slate-800">{postTat}d</span>
                        ) : feedbackPendingDays !== undefined ? (
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                            Pending ({feedbackPendingDays}d)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Not Dispatched</span>
                        )}
                      </td>

                      {/* Outcome */}
                      <td className="p-3 whitespace-nowrap">
                        {sample.trialResult ? (
                          <span
                            className={`text-[10px] font-bold ${
                              sample.trialResult === 'Approved'
                                ? 'text-emerald-700'
                                : sample.trialResult === 'Redevelopment Required'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {sample.trialResult}
                            {sample.redevelopmentCount > 0 && ` (#${sample.redevelopmentCount})`}
                          </span>
                        ) : sample.requirementMode === 'PRICE ONLY' ? (
                          <span className="text-[10px] text-blue-700 font-semibold">
                            {sample.priceStatus || 'Price Shared'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">In Progress</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSample(sample);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Open Lifecycle Drawer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
