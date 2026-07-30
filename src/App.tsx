import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { WebApp } from './types';
import { WebDeskProvider, useWebDesk } from './contexts/WebDeskContext';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { AppModal } from './components/AppModal';
import { CommandPalette } from './components/CommandPalette';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const {
    apps,
    profiles,
    workspaces,
    categories,
    settings,
    openWindowIds,
    currentTab,
    setCurrentTab,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activeProfileId,
    setActiveProfileId,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    toastMessage,
    launchApp,
    saveApp,
    deleteApp,
    duplicateApp,
    toggleFavorite,
    togglePin,
    createDesktopLauncher,
    createWorkspace,
    deleteWorkspace,
    createProfile,
    deleteProfile,
    updateSettings,
    exportData,
    importData,
  } = useWebDesk();

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<WebApp | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Theme application
  useEffect(() => {
    if (settings) {
      if (settings.theme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    }
  }, [settings]);

  // Filtering Apps
  const filteredApps = apps.filter((app) => {
    if (activeWorkspaceId !== 'ws-all' && app.workspaceId !== activeWorkspaceId) {
      return false;
    }
    if (selectedCategory !== 'All' && app.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery &&
      !app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.url.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const pinnedApps = apps.filter((a) => a.isPinned);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Title Bar */}
      <TitleBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          setActiveWorkspaceId={setActiveWorkspaceId}
          profiles={profiles}
          activeProfileId={activeProfileId}
          setActiveProfileId={setActiveProfileId}
          pinnedApps={pinnedApps}
          onOpenAddModal={() => {
            setEditingApp(null);
            setIsAddModalOpen(true);
          }}
          onLaunchApp={launchApp}
        />

        {/* Content Area */}
        <main className="flex-1 bg-slate-900/60 overflow-y-auto flex flex-col">
          {/* Toast Banner */}
          {toastMessage && (
            <div className="fixed top-12 right-6 z-50 bg-emerald-600/90 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          {currentTab === 'apps' && (
            <DashboardPage
              filteredApps={filteredApps}
              profiles={profiles}
              workspaces={workspaces}
              categories={categories}
              activeWorkspaceId={activeWorkspaceId}
              activeProfileId={activeProfileId}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openWindowIds={openWindowIds}
              onLaunchApp={launchApp}
              onToggleFavorite={toggleFavorite}
              onTogglePin={togglePin}
              onEditApp={(appToEdit) => {
                setEditingApp(appToEdit);
                setIsAddModalOpen(true);
              }}
              onDuplicateApp={duplicateApp}
              onDeleteApp={deleteApp}
              onCreateDesktopLauncher={createDesktopLauncher}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {currentTab === 'workspaces' && (
            <WorkspacePage
              workspaces={workspaces}
              apps={apps}
              onCreateWorkspace={createWorkspace}
              onDeleteWorkspace={deleteWorkspace}
              onSelectWorkspace={(id) => {
                setActiveWorkspaceId(id);
                setCurrentTab('apps');
              }}
            />
          )}

          {currentTab === 'profiles' && (
            <ProfilePage
              profiles={profiles}
              apps={apps}
              onCreateProfile={createProfile}
              onDeleteProfile={deleteProfile}
            />
          )}

          {currentTab === 'settings' && settings && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={updateSettings}
              onExportData={exportData}
              onImportData={importData}
            />
          )}
        </main>
      </div>

      {/* Add / Edit App Modal */}
      <AppModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApp(null);
        }}
        onSave={(data) => saveApp(data, editingApp?.id)}
        initialApp={editingApp}
        profiles={profiles}
        workspaces={workspaces}
        categories={categories}
      />

      {/* Quick Launch Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        apps={apps}
        workspaces={workspaces}
        profiles={profiles}
        onLaunchApp={launchApp}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />
    </div>
  );
};

export const App: React.FC = () => (
  <WebDeskProvider>
    <MainLayout />
  </WebDeskProvider>
);

export default App;
