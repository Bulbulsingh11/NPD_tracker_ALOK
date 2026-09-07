import React, { useState } from 'react';
import { NPDSample, TATTargets } from './types/npd';
import { DEMO_NPD_SAMPLES, DEFAULT_TAT_TARGETS } from './data/demoData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SampleRegister } from './components/register/SampleRegister';
import { TatMonitoring } from './components/tat/TatMonitoring';
import { TrialFeedback } from './components/feedback/TrialFeedback';
import { RedevelopmentAnalysis } from './components/redevelopment/RedevelopmentAnalysis';
import { MonthlyReportView } from './components/reports/MonthlyReportView';
import { ManagementInsights } from './components/insights/ManagementInsights';
import { ProposedWorkflow } from './components/workflow/ProposedWorkflow';
import { SettingsView } from './components/settings/SettingsView';
import { SampleDetailDrawer } from './components/lifecycle/SampleDetailDrawer';
import { NewSampleModal } from './components/register/NewSampleModal';

export function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [samples, setSamples] = useState<NPDSample[]>(DEMO_NPD_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<NPDSample | null>(null);
  const [tatTargets, setTatTargets] = useState<TATTargets>(DEFAULT_TAT_TARGETS);
  const [isNewSampleModalOpen, setIsNewSampleModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Handle adding a new sample
  const handleAddSample = (newSample: NPDSample) => {
    setSamples((prev) => [newSample, ...prev]);
    setSelectedSample(newSample);
  };

  // Handle updating an existing sample
  const handleUpdateSample = (updatedSample: NPDSample) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    setSelectedSample(updatedSample);
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    if (query.trim() && activeView !== 'register') {
      setActiveView('register');
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden select-none antialiased">
      {/* Main Left Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activeView={activeView}
          onSearch={handleGlobalSearch}
          onOpenNewSampleModal={() => setIsNewSampleModalOpen(true)}
          selectedMonth="July 2026"
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* View Switcher */}
            {activeView === 'dashboard' && (
              <ExecutiveDashboard
                samples={samples}
                onSelectSample={setSelectedSample}
                onOpenNewSampleModal={() => setIsNewSampleModalOpen(true)}
                onNavigate={setActiveView}
              />
            )}

            {activeView === 'register' && (
              <SampleRegister
                samples={samples}
                onSelectSample={setSelectedSample}
                onOpenNewSampleModal={() => setIsNewSampleModalOpen(true)}
              />
            )}

            {activeView === 'tat' && (
              <TatMonitoring
                samples={samples}
                targets={tatTargets}
                onUpdateTargets={setTatTargets}
                onSelectSample={setSelectedSample}
              />
            )}

            {activeView === 'feedback' && (
              <TrialFeedback
                samples={samples}
                onSelectSample={setSelectedSample}
              />
            )}

            {activeView === 'redevelopment' && (
              <RedevelopmentAnalysis
                samples={samples}
                onSelectSample={setSelectedSample}
              />
            )}

            {activeView === 'reports' && <MonthlyReportView />}

            {activeView === 'insights' && (
              <ManagementInsights
                samples={samples}
                onSelectSample={setSelectedSample}
              />
            )}

            {activeView === 'workflow' && <ProposedWorkflow />}

            {activeView === 'settings' && (
              <SettingsView
                targets={tatTargets}
                onUpdateTargets={setTatTargets}
              />
            )}
          </div>
        </main>
      </div>

      {/* Interactive Detail Drawer */}
      <SampleDetailDrawer
        sample={selectedSample}
        onClose={() => setSelectedSample(null)}
        onUpdateSample={handleUpdateSample}
      />

      {/* New Sample Registration Modal */}
      <NewSampleModal
        isOpen={isNewSampleModalOpen}
        onClose={() => setIsNewSampleModalOpen(false)}
        onAddSample={handleAddSample}
        nextSampleIndex={samples.length + 1}
      />
    </div>
  );
}

export default App;
