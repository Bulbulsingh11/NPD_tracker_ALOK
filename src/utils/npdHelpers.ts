import {
  NPDStatus,
  RequestType,
  RequirementMode,
  TrialOutcome,
  MarketType,
  NPDSample,
  RedevelopmentReason,
} from '../types/npd';

const REFERENCE_TODAY = '2026-08-17';

export function calculateDaysBetween(
  startDateStr?: string,
  endDateStr?: string
): number | undefined {
  if (!startDateStr || !endDateStr) return undefined;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
  const diffTime = end.getTime() - start.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : 0;
}

export function getCalculatedDevTat(sample: Partial<NPDSample>): number | undefined {
  if (sample.requirementMode === 'PRICE ONLY') return undefined;
  if (sample.requestDate && sample.developmentEndDate) {
    return calculateDaysBetween(sample.requestDate, sample.developmentEndDate);
  }
  return sample.tatDevelopment;
}

export function getCalculatedPostSampleTat(sample: Partial<NPDSample>): number | undefined {
  if (sample.requirementMode === 'PRICE ONLY') return undefined;
  if (sample.sampleDispatchDate && sample.feedbackDate) {
    return calculateDaysBetween(sample.sampleDispatchDate, sample.feedbackDate);
  }
  return sample.tatPostSample;
}

export function getCalculatedFeedbackPendingDays(sample: Partial<NPDSample>): number | undefined {
  if (sample.requirementMode === 'PRICE ONLY') return undefined;
  if (sample.sampleDispatchDate && !sample.feedbackDate) {
    return calculateDaysBetween(sample.sampleDispatchDate, REFERENCE_TODAY);
  }
  return sample.feedbackPendingDays;
}

export function getStatusBadgeStyle(status: NPDStatus): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (status) {
    case 'APPROVED':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Approved',
      };
    case 'REDEVELOPMENT REQUIRED':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Redevelopment Req.',
      };
    case 'REJECTED':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        text: 'text-rose-700',
        border: 'border-rose-200',
        label: 'Rejected',
      };
    case 'CLOSED':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        text: 'text-slate-700',
        border: 'border-slate-300',
        label: 'Closed / Handover',
      };
    case 'IN DEVELOPMENT':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        text: 'text-blue-700',
        border: 'border-blue-200',
        label: 'In Development',
      };
    case 'DEVELOPMENT COMPLETED':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        label: 'Dev. Completed',
      };
    case 'SAMPLE / PRICE SHARED':
      return {
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        label: 'Sample Dispatched',
      };
    case 'AWAITING CUSTOMER TRIAL':
    case 'TRIAL SCHEDULED':
    case 'TRIAL COMPLETED':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        text: 'text-purple-700',
        border: 'border-purple-200',
        label: 'Customer Trial',
      };
    case 'FEEDBACK PENDING':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
        text: 'text-orange-700',
        border: 'border-orange-200',
        label: 'Feedback Pending',
      };
    case 'FEEDBACK RECEIVED':
      return {
        bg: 'bg-teal-50 text-teal-700 border-teal-200',
        text: 'text-teal-700',
        border: 'border-teal-200',
        label: 'Feedback Received',
      };
    case 'PRICE PREPARATION':
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        text: 'text-sky-700',
        border: 'border-sky-200',
        label: 'Price Preparation',
      };
    case 'PRICE SHARED':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Price Shared',
      };
    case 'ASSIGNED':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        text: 'text-blue-800',
        border: 'border-blue-200',
        label: 'Assigned to Lab',
      };
    case 'PENDING ASSIGNMENT':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        text: 'text-amber-800',
        border: 'border-amber-200',
        label: 'Pending Lab Assign.',
      };
    case 'ON HOLD':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        text: 'text-slate-700',
        border: 'border-slate-300',
        label: 'On Hold',
      };
    case 'REQUEST RECEIVED':
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        text: 'text-slate-700',
        border: 'border-slate-200',
        label: 'Request Received',
      };
  }
}

export function getRequirementModeBadge(mode: RequirementMode): {
  bg: string;
  label: string;
} {
  if (mode === 'PRICE ONLY') {
    return {
      bg: 'bg-amber-100 text-amber-800 border border-amber-200',
      label: 'Price Only',
    };
  }
  return {
    bg: 'bg-blue-100 text-blue-800 border border-blue-200',
    label: 'Sample + Price',
  };
}

export function getRequestTypeBadge(type: RequestType): {
  bg: string;
  label: string;
} {
  switch (type) {
    case 'New Development':
      return {
        bg: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
        label: 'New Dev',
      };
    case 'Redevelopment':
      return {
        bg: 'bg-rose-100 text-rose-800 border border-rose-200',
        label: 'Redevelopment',
      };
    case 'Existing Grade':
      return {
        bg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        label: 'Existing Grade',
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-800 border border-slate-200',
        label: type,
      };
  }
}

export function getMarketTypeBadge(market: MarketType): {
  bg: string;
  text: string;
  label: string;
} {
  if (market === 'Export') {
    return {
      bg: 'bg-purple-100 text-purple-800 border border-purple-200',
      text: 'text-purple-800',
      label: 'Export',
    };
  }
  return {
    bg: 'bg-slate-100 text-slate-800 border border-slate-200',
    text: 'text-slate-800',
    label: 'Domestic',
  };
}

export function getStageNumber(stage: string): number {
  switch (stage) {
    case 'REQUEST RECEIVED':
    case 'REQUEST_RECEIVED':
      return 1;
    case 'ASSIGNED':
    case 'PENDING ASSIGNMENT':
    case 'LAB ASSIGNED':
      return 2;
    case 'IN DEVELOPMENT':
    case 'DEVELOPMENT':
      return 3;
    case 'DEVELOPMENT COMPLETED':
    case 'SAMPLE READY':
    case 'SAMPLE_READY':
      return 4;
    case 'SAMPLE / PRICE SHARED':
    case 'SAMPLE_DISPATCHED':
    case 'PRICE SHARED':
      return 5;
    case 'AWAITING CUSTOMER TRIAL':
    case 'CUSTOMER TRIAL':
    case 'CUSTOMER_TRIAL':
    case 'TRIAL SCHEDULED':
    case 'TRIAL COMPLETED':
      return 6;
    case 'FEEDBACK PENDING':
    case 'FEEDBACK RECEIVED':
    case 'FEEDBACK':
      return 7;
    case 'APPROVED':
    case 'REDEVELOPMENT REQUIRED':
    case 'REDEVELOPMENT_REQUIRED':
    case 'REJECTED':
    case 'CLOSED':
    case 'FINAL_DECISION':
      return 8;
    default:
      return 1;
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ];
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
