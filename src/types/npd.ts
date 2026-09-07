export type RequirementMode = 'SAMPLE + PRICE' | 'PRICE ONLY';

export type RequestType = 
  | 'New Development'
  | 'Redevelopment'
  | 'Existing Grade';

export type NPDStage = 
  | 'REQUEST RECEIVED'
  | 'LAB ASSIGNMENT'
  | 'IN DEVELOPMENT'
  | 'DEVELOPMENT COMPLETED'
  | 'SAMPLE / PRICE SHARED'
  | 'CUSTOMER TRIAL'
  | 'FEEDBACK PENDING'
  | 'FEEDBACK RECEIVED'
  | 'APPROVED'
  | 'REDEVELOPMENT REQUIRED'
  | 'REJECTED'
  | 'CLOSED'
  // For Price Only
  | 'PRICE PREPARATION'
  | 'PRICE SHARED';

export type NPDStatus = 
  | 'REQUEST RECEIVED'
  | 'PENDING ASSIGNMENT'
  | 'ASSIGNED'
  | 'IN DEVELOPMENT'
  | 'ON HOLD'
  | 'DEVELOPMENT COMPLETED'
  | 'SAMPLE / PRICE SHARED'
  | 'AWAITING CUSTOMER TRIAL'
  | 'TRIAL SCHEDULED'
  | 'TRIAL COMPLETED'
  | 'FEEDBACK PENDING'
  | 'FEEDBACK RECEIVED'
  | 'APPROVED'
  | 'REDEVELOPMENT REQUIRED'
  | 'REJECTED'
  | 'CLOSED'
  // For Price Only
  | 'PRICE PREPARATION'
  | 'PRICE SHARED';

export type TrialOutcome = 
  | 'Approved'
  | 'Redevelopment Required'
  | 'Rejected'
  | 'Trial Pending';

export type MarketType = 'Domestic' | 'Export';

export type MasterbatchCategory = 
  | 'White Masterbatch'
  | 'Black Masterbatch'
  | 'Color Masterbatch'
  | 'Additive Masterbatch'
  | 'Filler / Modifier'
  | 'Specialty Masterbatch'
  | 'Engineering Polymer Compound'
  | 'Biodegradable Compound';

export type RedevelopmentReason = 
  | 'Colour Mismatch'
  | 'Quality Issue'
  | 'Performance Issue'
  | 'Customer Requirement Change'
  | 'Processing Issue'
  | 'Other';

export interface RedevelopmentCycle {
  cycleNumber: number; // 1, 2, 3
  startDate: string;
  assignedLabEmployee: string;
  reason: RedevelopmentReason;
  completedDate?: string;
  redevelopmentRemarks?: string;
  redevelopmentTatDays?: number;
  status: 'In Progress' | 'Completed';
}

export interface StageHistoryItem {
  stageName: string;
  date: string;
  completedDate?: string;
  responsiblePerson: string;
  department: 'Sales' | 'R&D / Lab' | 'Pilot Plant / Compounding' | 'QA/QC' | 'Logistics' | 'Customer / Technical Service' | 'Commercial';
  remarks: string;
  tatDays?: number;
  status: 'completed' | 'in_progress' | 'pending' | 'on_hold';
}

export interface NPDSample {
  id: string; // e.g. NPD-2026-08-001 (Unique single ID across all stages)
  requestDate: string; // YYYY-MM-DD
  month: string; // 'April 2026' | 'May 2026' | 'June 2026' | 'July 2026' | 'August 2026'
  
  // 1. Sales Executive Request Info
  requestedBy: string; // Alok Sales Executive Name
  customer: string;
  customerLocation: string;
  country?: string;
  productGrade: string;
  sampleDescription: string;
  requestType: RequestType; // 'New Development' | 'Redevelopment' | 'Existing Grade'
  requirementMode: RequirementMode; // 'SAMPLE + PRICE' | 'PRICE ONLY'
  customerRequirementRemarks?: string;
  sampleQuantityKg: number;
  marketType: MarketType;
  category: MasterbatchCategory;
  polymerCarrier: string; // e.g. LLDPE, PP, PET, ABS, HDPE
  application: string; // e.g. Blown Film Extrusion, Injection Moulding, Blow Moulding, Raffia, Pipe Extrusion
  isPriority?: boolean; // High Priority / Urgent flag

  // Current State
  currentStage: NPDStage;
  status: NPDStatus;

  // 2. Lab Assignment
  assignedTo: string; // Currently Assigned Lab Employee / Chemist
  labAssignmentDate?: string;
  targetCompletionDate?: string;
  labRemarks?: string;

  // 3. Development Completion
  developmentStartDate?: string;
  developmentEndDate?: string;
  developedGrade?: string;
  developedQuantityKg?: number;
  developmentRemarks?: string;
  internalQcResult?: 'Pass' | 'Conditional Pass' | 'Fail' | 'Pending';

  // 4. Sample Dispatch & Price Handover
  sampleReadyDate?: string;
  sampleDispatchDate?: string;
  dispatchDetails?: string; // Courier & tracking info
  quantitySentKg?: number;
  priceSharedDate?: string;
  pricePerKg?: string;
  priceStatus?: 'Pending' | 'Prepared' | 'Shared with Sales' | 'Shared with Customer' | 'Accepted' | 'Negotiating';

  // 5. Customer Trial & Sales Feedback (Entered by Sales Executive)
  feedbackEnteredBy?: string; // Sales Executive
  trialDate?: string;
  trialResult?: TrialOutcome;
  feedbackDate?: string;
  customerFeedbackRemarks?: string;
  customerRequirementChanges?: string;
  nextAction?: string;
  closureDate?: string;

  // 6. Redevelopment Details (Linked to Original ID)
  redevelopmentCount: number;
  redevelopmentReason?: RedevelopmentReason;
  redevelopmentNotes?: string;
  redevelopmentCycles?: RedevelopmentCycle[];

  // 7. Auto-Calculated TAT Computations (in days)
  tatDevelopment?: number;       // Request Date -> Development Completed Date
  tatAssignmentToDev?: number;   // Lab Assignment Date -> Development Completed Date
  tatPostSample?: number;        // Sample Dispatch Date -> Customer Feedback Date
  feedbackPendingDays?: number;  // If feedback pending: Dispatch Date -> Today
  tatRedevelopment?: number;     // Redevelopment Start -> Redevelopment Completed
  tatOverall?: number;           // Total Request -> Final Closure or Current Age
  isTatBreached?: boolean;       // If tatDevelopment > targetDevTat (default: 7 days)

  // Full Audit Trail
  history: StageHistoryItem[];
}

export interface LabChemistPerformance {
  employeeName: string;
  assignedCount: number;
  completedCount: number;
  pendingCount: number;
  avgDevTatDays: number;
  tatCompliancePct: number;
  redevelopmentsCount: number;
}

export interface MonthlyNPDReport {
  month: string;
  
  // Request Summary
  totalRequests: number;
  newDevelopmentCount: number;
  redevelopmentCount: number;
  existingGradeCount: number;
  sampleAndPriceCount: number;
  priceOnlyCount: number;
  exportSamples?: number;
  localSamples?: number;
  additionalExistingGradeRequests?: number;
  sampleQuantityKg?: number;
  
  // Lab Performance (Excludes Price Only)
  totalSamplesAssigned: number;
  totalDeveloped: number;
  pendingDevelopment: number;
  averageLabTatDays: number;
  tatCompliancePct: number;
  delayedSamplesCount: number;
  
  // Post-Sample Performance
  samplesDispatched: number;
  feedbackReceivedCount: number;
  feedbackPendingCount: number;
  averagePostSampleTatDays: number;
  
  // Customer Outcome
  approvedCount: number;
  redevelopmentRequiredCount: number;
  rejectedCount: number;
  trialPendingCount: number;
  
  // Redevelopment Metrics
  totalRedevelopments: number;
  redevelopmentRatePct: number;
  averageRedevelopmentTatDays: number;
  redevelopmentReasonsBreakdown: Record<RedevelopmentReason, number>;
  
  // Lab Efficiency breakdown
  chemistsPerformance: LabChemistPerformance[];
}

export interface TATTargets {
  developmentDays: number; // default: 7
  feedbackDays: number;    // default: 7
  dispatchDays: number;    // default: 2
  trialDays: number;       // default: 5
}
