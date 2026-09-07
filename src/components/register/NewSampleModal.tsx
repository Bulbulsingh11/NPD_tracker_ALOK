import React, { useState } from 'react';
import {
  NPDSample,
  MasterbatchCategory,
  MarketType,
  RequestType,
  RequirementMode,
} from '../../types/npd';
import { LAB_CHEMISTS, SALES_EXECUTIVES } from '../../data/demoData';
import {
  X,
  PlusCircle,
  FlaskConical,
  Building,
  User,
  Package,
  Layers,
  AlertCircle,
  Tag,
  DollarSign,
  FileText,
} from 'lucide-react';

interface NewSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSample: (sample: NPDSample) => void;
  nextSampleIndex: number;
}

export const NewSampleModal: React.FC<NewSampleModalProps> = ({
  isOpen,
  onClose,
  onAddSample,
  nextSampleIndex,
}) => {
  if (!isOpen) return null;

  const generatedId = `NPD-2026-08-${String(nextSampleIndex).padStart(3, '0')}`;
  const todayStr = '2026-08-17';

  // Form State
  const [requestedBy, setRequestedBy] = useState(SALES_EXECUTIVES[0]);
  const [customer, setCustomer] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [productGrade, setProductGrade] = useState('');
  const [sampleDescription, setSampleDescription] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('New Development');
  const [requirementMode, setRequirementMode] = useState<RequirementMode>('SAMPLE + PRICE');
  const [customerRequirementRemarks, setCustomerRequirementRemarks] = useState('');
  const [sampleQuantityKg, setSampleQuantityKg] = useState<number>(2.0);
  const [marketType, setMarketType] = useState<MarketType>('Domestic');
  const [category, setCategory] = useState<MasterbatchCategory>('Color Masterbatch');
  const [polymerCarrier, setPolymerCarrier] = useState('LLDPE');
  const [application, setApplication] = useState('Blown Film Extrusion');
  const [isPriority, setIsPriority] = useState(false);
  const [assignedTo, setAssignedTo] = useState(LAB_CHEMISTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !productGrade) return;

    const isPriceOnly = requirementMode === 'PRICE ONLY';

    const newSample: NPDSample = {
      id: generatedId,
      requestDate: todayStr,
      month: 'August 2026',
      requestedBy,
      customer,
      customerLocation: customerLocation || 'Mumbai, MH',
      productGrade,
      sampleDescription: sampleDescription || `${category} formulation for ${customer}`,
      requestType,
      requirementMode,
      customerRequirementRemarks,
      sampleQuantityKg: isPriceOnly ? 0 : Number(sampleQuantityKg),
      marketType,
      category,
      polymerCarrier,
      application,
      isPriority,

      currentStage: isPriceOnly ? 'PRICE PREPARATION' : 'LAB ASSIGNMENT',
      status: isPriceOnly ? 'PRICE PREPARATION' : 'PENDING ASSIGNMENT',

      assignedTo: isPriceOnly ? 'N/A (Commercial Pricing Desk)' : assignedTo,
      labAssignmentDate: isPriceOnly ? undefined : todayStr,
      targetCompletionDate: isPriceOnly ? undefined : '2026-08-24',

      priceStatus: 'Pending',
      redevelopmentCount: 0,

      history: [
        {
          stageName: isPriceOnly ? '1. Price Request Received' : '1. Request Received',
          date: todayStr,
          responsiblePerson: requestedBy,
          department: 'Sales',
          remarks: `${requirementMode} request logged by ${requestedBy}. ${customerRequirementRemarks || ''}`,
          status: 'completed',
        },
        ...(isPriceOnly
          ? [
              {
                stageName: '2. Commercial Pricing Preparation',
                date: todayStr,
                responsiblePerson: 'Commercial Pricing Desk',
                department: 'Commercial' as const,
                remarks: 'Cost analysis and price calculation in progress.',
                status: 'in_progress' as const,
              },
            ]
          : [
              {
                stageName: '2. Lab Assignment',
                date: todayStr,
                responsiblePerson: assignedTo,
                department: 'R&D / Lab' as const,
                remarks: `Assigned to ${assignedTo} for development formulation.`,
                status: 'in_progress' as const,
              },
            ]),
      ],
    };

    onAddSample(newSample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold">New Sample / Price Request</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Alok Masterbatches NPD Intake • Auto ID:{' '}
              <span className="font-mono text-blue-300 font-bold">{generatedId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          {/* Requirement Mode Selector (Critical Switch) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" /> Requirement Mode (Crucial)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequirementMode('SAMPLE + PRICE')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  requirementMode === 'SAMPLE + PRICE'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">SAMPLE + PRICE</span>
                  <FlaskConical className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-normal">
                  Requires physical lab compounding & customer plant trial. Tracked in Lab TAT.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRequirementMode('PRICE ONLY')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  requirementMode === 'PRICE ONLY'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">PRICE ONLY</span>
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-normal">
                  Commercial quote only. Excluded from Lab TAT & Lab Efficiency metrics.
                </div>
              </button>
            </div>
          </div>

          {/* Core Identification Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Sales Executive Name <span className="text-rose-500">*</span>
              </label>
              <select
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full border border-slate-200 rounded-md p-2 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {SALES_EXECUTIVES.map((sales) => (
                  <option key={sales} value={sales}>
                    {sales}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Request Date
              </label>
              <input
                type="text"
                value={todayStr}
                disabled
                className="w-full border border-slate-200 rounded-md p-2 bg-slate-100 font-mono text-slate-600"
              />
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Reliance Polymers Ltd"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full border border-slate-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Customer Location
              </label>
              <input
                type="text"
                placeholder="e.g. Silvassa, Gujarat / Dubai, UAE"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full border border-slate-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Product Grade & Request Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 mb-1 block">
                Product / Grade Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AL-W001 Super White MB"
                value={productGrade}
                onChange={(e) => setProductGrade(e.target.value)}
                className="w-full border border-slate-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Request Type
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as RequestType)}
                className="w-full border border-slate-200 rounded-md p-2 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="New Development">New Development</option>
                <option value="Redevelopment">Redevelopment</option>
                <option value="Existing Grade">Existing Grade</option>
              </select>
            </div>
          </div>

          {/* Sample Description */}
          <div>
            <label className="font-bold text-slate-700 mb-1 block">
              Sample Description
            </label>
            <input
              type="text"
              placeholder="e.g. 70% TiO2 rutile masterbatch in LLDPE carrier for milk packaging"
              value={sampleDescription}
              onChange={(e) => setSampleDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Polymer, Category, Application & Quantity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MasterbatchCategory)}
                className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
              >
                <option value="Color Masterbatch">Color Masterbatch</option>
                <option value="White Masterbatch">White Masterbatch</option>
                <option value="Black Masterbatch">Black Masterbatch</option>
                <option value="Additive Masterbatch">Additive Masterbatch</option>
                <option value="Filler / Modifier">Filler / Modifier</option>
                <option value="Specialty Masterbatch">Specialty Masterbatch</option>
                <option value="Engineering Polymer Compound">Engineering Compound</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Carrier Resin</label>
              <select
                value={polymerCarrier}
                onChange={(e) => setPolymerCarrier(e.target.value)}
                className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
              >
                <option value="LLDPE">LLDPE</option>
                <option value="LDPE">LDPE</option>
                <option value="HDPE">HDPE</option>
                <option value="PP">PP (Polypropylene)</option>
                <option value="PET">PET</option>
                <option value="HIPS/ABS">HIPS / ABS</option>
                <option value="Universal">Universal Carrier</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Application</label>
              <select
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                className="w-full border border-slate-200 rounded-md p-2 bg-white outline-none"
              >
                <option value="Blown Film Extrusion">Blown Film Extrusion</option>
                <option value="Injection Moulding">Injection Moulding</option>
                <option value="Blow Moulding">Blow Moulding</option>
                <option value="Raffia">Raffia Woven Sacks</option>
                <option value="Pipe Extrusion">Pipe Extrusion</option>
                <option value="Sheet / Thermoforming">Sheet / Thermoforming</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Sample Qty (KG) {requirementMode === 'PRICE ONLY' && '(N/A)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                disabled={requirementMode === 'PRICE ONLY'}
                value={requirementMode === 'PRICE ONLY' ? 0 : sampleQuantityKg}
                onChange={(e) => setSampleQuantityKg(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-md p-2 bg-white disabled:bg-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Customer Requirement / Remarks */}
          <div>
            <label className="font-bold text-slate-700 mb-1 block">
              Customer Requirement / Technical Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Specify technical parameters: ΔE target, LDR %, food contact compliance, thermal stability, processing line specs..."
              value={customerRequirementRemarks}
              onChange={(e) => setCustomerRequirementRemarks(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Lab Assignment (Only if SAMPLE + PRICE) */}
          {requirementMode === 'SAMPLE + PRICE' && (
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-blue-900 mb-1 block">
                  Assign Lab Employee / Chemist
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full border border-blue-200 rounded-md p-2 bg-white outline-none text-slate-800"
                >
                  {LAB_CHEMISTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-semibold">
                  <input
                    type="checkbox"
                    checked={isPriority}
                    onChange={(e) => setIsPriority(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Mark as High-Priority / Fast-Track SLA (★)</span>
                </label>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
