import React, { useState } from 'react';
import {
  NPDSample,
  NPDStatus,
  RedevelopmentReason,
  TrialOutcome,
} from '../../types/npd';
import { LAB_CHEMISTS, SALES_EXECUTIVES } from '../../data/demoData';
import {
  X,
  Calendar,
  User,
  Building,
  Tag,
  Package,
  Layers,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  Sparkles,
  FlaskConical,
  DollarSign,
  FileText,
  Star,
  CheckCircle,
  Truck,
  MessageSquare,
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

interface SampleDetailDrawerProps {
  sample: NPDSample | null;
  onClose: () => void;
  onUpdateSample: (updatedSample: NPDSample) => void;
}

export const SampleDetailDrawer: React.FC<SampleDetailDrawerProps> = ({
  sample,
  onClose,
  onUpdateSample,
}) => {
  if (!sample) return null;

  const [activeTab, setActiveTab] = useState<'lifecycle' | 'lab_action' | 'dispatch_action' | 'sales_feedback' | 'redevelopment'>('lifecycle');

  // Lab Update Form State
  const [devCompletedDate, setDevCompletedDate] = useState(sample.developmentEndDate || '2026-08-17');
  const [developedGrade, setDevelopedGrade] = useState(sample.developedGrade || `${sample.productGrade}-V1`);
  const [developedQuantityKg, setDevelopedQuantityKg] = useState(sample.developedQuantityKg || sample.sampleQuantityKg || 2.0);
  const [devRemarks, setDevRemarks] = useState(sample.developmentRemarks || '');
  const [internalQc, setInternalQc] = useState<'Pass' | 'Conditional Pass' | 'Fail'>(sample.internalQcResult === 'Fail' ? 'Fail' : 'Pass');

  // Dispatch & Price Form State
  const [dispatchDate, setDispatchDate] = useState(sample.sampleDispatchDate || '2026-08-17');
  const [dispatchDetails, setDispatchDetails] = useState(sample.dispatchDetails || 'Blue Dart Airway Bill #');
  const [pricePerKg, setPricePerKg] = useState(sample.pricePerKg || '₹180 / KG');
  const [priceSharedDate, setPriceSharedDate] = useState(sample.priceSharedDate || '2026-08-17');

  // Sales Feedback Form State (Entered by Sales Exec)
  const [feedbackSalesExec, setFeedbackSalesExec] = useState(sample.feedbackEnteredBy || sample.requestedBy);
  const [feedbackDate, setFeedbackDate] = useState(sample.feedbackDate || '2026-08-17');
  const [trialDate, setTrialDate] = useState(sample.trialDate || '2026-08-15');
  const [trialResult, setTrialResult] = useState<TrialOutcome>(sample.trialResult || 'Approved');
  const [feedbackRemarks, setFeedbackRemarks] = useState(sample.customerFeedbackRemarks || '');
  const [specChanges, setSpecChanges] = useState(sample.customerRequirementChanges || '');
  const [nextAction, setNextAction] = useState(sample.nextAction || '');

  // Redevelopment Form State
  const [redevReason, setRedevReason] = useState<RedevelopmentReason>(sample.redevelopmentReason || 'Colour Mismatch');
  const [redevChemist, setRedevChemist] = useState(sample.assignedTo || LAB_CHEMISTS[0]);
  const [redevNotes, setRedevNotes] = useState(sample.redevelopmentNotes || '');

  const statusStyle = getStatusBadgeStyle(sample.status);
  const modeBadge = getRequirementModeBadge(sample.requirementMode);
  const typeBadge = getRequestTypeBadge(sample.requestType);
  const devTat = getCalculatedDevTat(sample);
  const postTat = getCalculatedPostSampleTat(sample);
  const pendingFeedbackDays = getCalculatedFeedbackPendingDays(sample);

  // 1. Submit Lab Development Completion
  const handleCompleteLabDev = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: NPDSample = {
      ...sample,
      status: 'DEVELOPMENT COMPLETED',
      currentStage: 'DEVELOPMENT COMPLETED',
      developmentEndDate: devCompletedDate,
      developedGrade,
      developedQuantityKg: Number(developedQuantityKg),
      developmentRemarks: devRemarks,
      internalQcResult: internalQc,
      sampleReadyDate: devCompletedDate,
      tatDevelopment: devTat || 5,
      history: [
        ...sample.history,
        {
          stageName: '3. Development Completed',
          date: devCompletedDate,
          responsiblePerson: sample.assignedTo,
          department: 'Pilot Plant / Compounding',
          remarks: `Development completed for ${developedGrade}. QC: ${internalQc}. ${devRemarks}`,
          status: 'completed',
        },
      ],
    };
    onUpdateSample(updated);
    setActiveTab('lifecycle');
  };

  // 2. Submit Dispatch & Price Handover
  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: NPDSample = {
      ...sample,
      status: 'SAMPLE / PRICE SHARED',
      currentStage: 'SAMPLE / PRICE SHARED',
      sampleDispatchDate: dispatchDate,
      dispatchDetails,
      pricePerKg,
      priceSharedDate,
      priceStatus: 'Shared with Customer',
      history: [
        ...sample.history,
        {
          stageName: '4. Sample Dispatched & Price Shared',
          date: dispatchDate,
          responsiblePerson: 'Logistics Desk',
          department: 'Logistics',
          remarks: `Dispatched via ${dispatchDetails}. Price ${pricePerKg} shared with customer.`,
          status: 'completed',
        },
      ],
    };
    onUpdateSample(updated);
    setActiveTab('lifecycle');
  };

  // 3. Submit Customer Feedback (By Sales Executive)
  const handleSaveSalesFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const isRedev = trialResult === 'Redevelopment Required';
    const isApproved = trialResult === 'Approved';
    const isRejected = trialResult === 'Rejected';

    const newStatus: NPDStatus = isApproved
      ? 'APPROVED'
      : isRedev
      ? 'REDEVELOPMENT REQUIRED'
      : isRejected
      ? 'REJECTED'
      : 'FEEDBACK RECEIVED';

    const updated: NPDSample = {
      ...sample,
      status: newStatus,
      currentStage: newStatus as any,
      feedbackEnteredBy: feedbackSalesExec,
      feedbackDate,
      trialDate,
      trialResult,
      customerFeedbackRemarks: feedbackRemarks,
      customerRequirementChanges: specChanges,
      nextAction,
      tatPostSample: postTat || 6,
      redevelopmentCount: isRedev ? sample.redevelopmentCount + 1 : sample.redevelopmentCount,
      redevelopmentReason: isRedev ? redevReason : sample.redevelopmentReason,
      redevelopmentNotes: isRedev ? (redevNotes || feedbackRemarks) : sample.redevelopmentNotes,
      redevelopmentCycles: isRedev
        ? [
            ...(sample.redevelopmentCycles || []),
            {
              cycleNumber: (sample.redevelopmentCount || 0) + 1,
              startDate: feedbackDate,
              assignedLabEmployee: redevChemist,
              reason: redevReason,
              status: 'In Progress',
              redevelopmentRemarks: feedbackRemarks,
            },
          ]
        : sample.redevelopmentCycles,
      history: [
        ...sample.history,
        {
          stageName: `6. Sales Feedback: ${trialResult}`,
          date: feedbackDate,
          responsiblePerson: feedbackSalesExec,
          department: 'Sales',
          remarks: `Recorded by Sales Exec ${feedbackSalesExec}: ${feedbackRemarks}. Result: ${trialResult}`,
          status: isApproved || isRejected ? 'completed' : 'in_progress',
        },
      ],
    };
    onUpdateSample(updated);
    setActiveTab('lifecycle');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-3xl bg-white h-full min-h-screen shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top Header */}
        <div>
          <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {sample.isPriority && (
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" title="High Priority Fast-Track" />
                )}
                <span className="font-mono text-base font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {sample.id}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">{sample.productGrade}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{sample.customer}</span>
                  <span>•</span>
                  <span>{sample.customerLocation}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                title="Print Job Card"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Card</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Key Status & TAT Strip */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg}`}>
                {statusStyle.label}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Requirement Mode</span>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${modeBadge.bg}`}>
                {modeBadge.label}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lab Dev. TAT</span>
              <span className="font-mono font-bold text-slate-800 text-xs">
                {sample.requirementMode === 'PRICE ONLY'
                  ? 'N/A'
                  : devTat !== undefined
                  ? `${devTat} Days ${devTat > 7 ? '(Breached)' : '(Within SLA)'}`
                  : 'In Lab'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Post-Sample TAT</span>
              <span className="font-mono font-bold text-slate-800 text-xs">
                {sample.requirementMode === 'PRICE ONLY'
                  ? 'N/A'
                  : postTat !== undefined
                  ? `${postTat} Days`
                  : pendingFeedbackDays !== undefined
                  ? `Pending (${pendingFeedbackDays}d)`
                  : 'Pending'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 px-6 bg-white gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('lifecycle')}
              className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'lifecycle'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Full Lifecycle Trail (8 Stages)
            </button>

            {sample.requirementMode === 'SAMPLE + PRICE' && (
              <>
                <button
                  onClick={() => setActiveTab('lab_action')}
                  className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'lab_action'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Lab Update</span>
                </button>

                <button
                  onClick={() => setActiveTab('dispatch_action')}
                  className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'dispatch_action'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch & Price</span>
                </button>

                <button
                  onClick={() => setActiveTab('sales_feedback')}
                  className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'sales_feedback'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-emerald-700">Sales Feedback</span>
                </button>
              </>
            )}

            {sample.redevelopmentCount > 0 && (
              <button
                onClick={() => setActiveTab('redevelopment')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'redevelopment'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Redevelopment ({sample.redevelopmentCount})</span>
              </button>
            )}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 space-y-6">
            {/* TAB 1: Complete Lifecycle Audit Trail */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-6">
                {/* 1. Request Info Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" /> 1. Sales Request Details
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Logged: {formatDate(sample.requestDate)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Alok Sales Executive</span>
                      <span className="font-bold text-slate-800">{sample.requestedBy}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Product / Grade</span>
                      <span className="font-bold text-slate-800">{sample.productGrade}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Carrier & Application</span>
                      <span className="font-medium text-slate-800">{sample.polymerCarrier} • {sample.application}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Required Quantity</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {sample.sampleQuantityKg > 0 ? `${sample.sampleQuantityKg} KG` : 'N/A (Price Only)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Currently Assigned To</span>
                      <span className="font-bold text-blue-700">{sample.assignedTo}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Request Type</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${typeBadge.bg}`}>
                        {typeBadge.label}
                      </span>
                    </div>
                  </div>

                  {sample.customerRequirementRemarks && (
                    <div className="pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-400 block text-[10px] font-bold">Customer Requirement Remarks:</span>
                      <p className="text-slate-700 italic mt-0.5 bg-white p-2 rounded border border-slate-200">
                        "{sample.customerRequirementRemarks}"
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Chronological Stage Progression */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> Milestone History & Responsibility
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {sample.history.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                            step.status === 'completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : step.status === 'in_progress'
                              ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-slate-900">{step.stageName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{formatDate(step.date)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="font-medium text-slate-700">{step.responsiblePerson}</span>
                            <span>•</span>
                            <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">{step.department}</span>
                            {step.tatDays !== undefined && (
                              <span className="ml-auto font-mono text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                                TAT: {step.tatDays}d
                              </span>
                            )}
                          </div>

                          {step.remarks && (
                            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                              {step.remarks}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Customer Trial & Sales Feedback Block */}
                {sample.trialResult && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" /> Sales Feedback Outcome
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {sample.trialResult}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium">
                      "{sample.customerFeedbackRemarks}"
                    </p>
                    <div className="text-[11px] text-emerald-700 flex items-center justify-between pt-1">
                      <span>Entered by Sales Exec: <strong>{sample.feedbackEnteredBy}</strong></span>
                      <span className="font-mono">Feedback Date: {formatDate(sample.feedbackDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Lab Chemist Development Update */}
            {activeTab === 'lab_action' && (
              <form onSubmit={handleCompleteLabDev} className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" /> Lab Development Completion
                  </h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Assigned Chemist: <strong>{sample.assignedTo}</strong>. Complete physical formulation & pilot batch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Development Completed Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={devCompletedDate}
                      onChange={(e) => setDevCompletedDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Developed Grade Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={developedGrade}
                      onChange={(e) => setDevelopedGrade(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Developed Sample Quantity (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={developedQuantityKg}
                      onChange={(e) => setDevelopedQuantityKg(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Internal Lab QC Result
                    </label>
                    <select
                      value={internalQc}
                      onChange={(e) => setInternalQc(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    >
                      <option value="Pass">Pass (Meets all specs)</option>
                      <option value="Conditional Pass">Conditional Pass</option>
                      <option value="Fail">Fail (Re-compounding needed)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">
                    Development Remarks / Formulation Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide extruder temperature settings, pigment ratio, dispersion plaque observations..."
                    value={devRemarks}
                    onChange={(e) => setDevRemarks(e.target.value)}
                    className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Mark Development Completed
                </button>
              </form>
            )}

            {/* TAB 3: Sample Dispatch & Price Handover */}
            {activeTab === 'dispatch_action' && (
              <form onSubmit={handleSaveDispatch} className="space-y-4 text-xs">
                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <h4 className="font-bold text-cyan-900 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Sample Dispatch & Price Quotation
                  </h4>
                  <p className="text-[11px] text-cyan-700 mt-0.5">
                    Log courier airway bill and official price quotation shared with customer.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Dispatch Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dispatchDate}
                      onChange={(e) => setDispatchDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Courier / Airway Bill Details
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blue Dart AWB #894210943"
                      value={dispatchDetails}
                      onChange={(e) => setDispatchDetails(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Quoted Price / KG
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹185 / KG"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Price Shared Date
                    </label>
                    <input
                      type="date"
                      value={priceSharedDate}
                      onChange={(e) => setPriceSharedDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Save Dispatch & Price Details
                </button>
              </form>
            )}

            {/* TAB 4: Customer Feedback (Sales Executive Responsibilty) */}
            {activeTab === 'sales_feedback' && (
              <form onSubmit={handleSaveSalesFeedback} className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Sales Executive Customer Feedback Entry
                    </h4>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded">
                      Sales Responsibility
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Entered directly by the Alok Sales Executive after plant line trial with the customer.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Sales Executive <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={feedbackSalesExec}
                      onChange={(e) => setFeedbackSalesExec(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none font-medium"
                    >
                      {SALES_EXECUTIVES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Feedback Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={feedbackDate}
                      onChange={(e) => setFeedbackDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Customer Plant Trial Date
                    </label>
                    <input
                      type="date"
                      value={trialDate}
                      onChange={(e) => setTrialDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">
                    Trial Result Outcome <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Approved', label: 'Approved', color: 'border-emerald-600 bg-emerald-50 text-emerald-800' },
                      { id: 'Redevelopment Required', label: 'Redevelopment Req.', color: 'border-amber-600 bg-amber-50 text-amber-800' },
                      { id: 'Rejected', label: 'Rejected', color: 'border-rose-600 bg-rose-50 text-rose-800' },
                      { id: 'Trial Pending', label: 'Trial Pending', color: 'border-slate-400 bg-slate-50 text-slate-700' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTrialResult(opt.id as TrialOutcome)}
                        className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                          trialResult === opt.id
                            ? `${opt.color} ring-1`
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* If Redevelopment is required, prompt for reason */}
                {trialResult === 'Redevelopment Required' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                    <h5 className="font-bold text-amber-900 text-xs">
                      Redevelopment Cycle Configuration (Linked to {sample.id})
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-amber-900 mb-1 block">
                          Redevelopment Reason
                        </label>
                        <select
                          value={redevReason}
                          onChange={(e) => setRedevReason(e.target.value as RedevelopmentReason)}
                          className="w-full border border-amber-300 rounded-md p-2 bg-white outline-none"
                        >
                          <option value="Colour Mismatch">Colour Mismatch</option>
                          <option value="Quality Issue">Quality Issue</option>
                          <option value="Performance Issue">Performance Issue</option>
                          <option value="Customer Requirement Change">Customer Requirement Change</option>
                          <option value="Processing Issue">Processing Issue</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-amber-900 mb-1 block">
                          Assign Lab Chemist for V{sample.redevelopmentCount + 2}
                        </label>
                        <select
                          value={redevChemist}
                          onChange={(e) => setRedevChemist(e.target.value)}
                          className="w-full border border-amber-300 rounded-md p-2 bg-white outline-none"
                        >
                          {LAB_CHEMISTS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">
                    Customer Feedback / Technical Remarks <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter verbatim feedback from plant in-charge: e.g. color match ΔE, extrusion speed, opacity, film gloss..."
                    value={feedbackRemarks}
                    onChange={(e) => setFeedbackRemarks(e.target.value)}
                    className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Customer Requirement Changes (If any)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Adjust let down ratio from 2% to 1.5%"
                      value={specChanges}
                      onChange={(e) => setSpecChanges(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 mb-1 block">
                      Next Action / Next Step
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Commercial order of 5 MT / Lab reformulate V2"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Record Customer Feedback & Update Lifecycle
                </button>
              </form>
            )}

            {/* TAB 5: Redevelopment Cycles History */}
            {activeTab === 'redevelopment' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-amber-900">
                      Redevelopment Iterations ({sample.redevelopmentCount} Cycles)
                    </h4>
                    <p className="text-[11px] text-amber-700">
                      Linked directly to parent Sample ID: <strong>{sample.id}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded">
                    Reason: {sample.redevelopmentReason || 'Colour Mismatch'}
                  </span>
                </div>

                <div className="space-y-3">
                  {sample.redevelopmentCycles?.map((cycle) => (
                    <div key={cycle.cycleNumber} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>Cycle #{cycle.cycleNumber}</span>
                        <span className="text-xs text-amber-600">{cycle.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Started: {formatDate(cycle.startDate)} • Chemist: {cycle.assignedLabEmployee}
                      </div>
                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded">
                        {cycle.redevelopmentRemarks || 'Reformulation underway.'}
                      </p>
                    </div>
                  )) || (
                    <div className="text-slate-500 text-xs italic">
                      Redevelopment recorded for reason: {sample.redevelopmentReason}. Formulating next version.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Unique Single ID: <strong className="font-mono text-slate-800">{sample.id}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
