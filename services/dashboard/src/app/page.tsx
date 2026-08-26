'use client'

import React, { useState } from 'react';

export default function Home() {
  const [migrationStatus, setMigrationStatus] = useState<{ loading: boolean, message: string, type: 'success' | 'error' | 'info' | null }>({
    loading: false,
    message: '',
    type: null
  });

  const handleMigrateGitHub = async () => {
    const repoUrl = prompt('Enter GitHub Repository URL:');
    const projectName = prompt('Enter a name for this project:');

    if (!repoUrl || !projectName) return;

    setMigrationStatus({ loading: true, message: 'Migrating from GitHub...', type: 'info' });

    try {
      const response = await fetch('/api/control-plane/migrate/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, projectName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMigrationStatus({ loading: false, message: `Success! Schema created: ${data.schema}`, type: 'success' });
      } else {
        setMigrationStatus({ loading: false, message: `Error: ${data.error}`, type: 'error' });
      }
    } catch (error) {
      setMigrationStatus({ loading: false, message: 'Failed to connect to the migration server.', type: 'error' });
    }
  };

  const handleMigrateLovable = async () => {
    const projectId = prompt('Enter Lovable Project ID:');
    const projectName = prompt('Enter a name for this project:');

    if (!projectId || !projectName) return;

    setMigrationStatus({ loading: true, message: 'Migrating from Lovable...', type: 'info' });

    try {
      const response = await fetch('/api/control-plane/migrate/lovable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, projectName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMigrationStatus({ loading: false, message: `Success! Schema created: ${data.schema}`, type: 'success' });
      } else {
        setMigrationStatus({ loading: false, message: `Error: ${data.error}`, type: 'error' });
      }
    } catch (error) {
      setMigrationStatus({ loading: false, message: 'Failed to connect to the migration server.', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans p-8">
      <header className="mb-12 border-b border-gray-700 pb-4">
        <h1 className="text-4xl font-bold tracking-tight">NeerCloud Dashboard</h1>
        <p className="text-gray-400 mt-2 text-lg">ZimaOS Local Environment</p>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Environment Status Panel */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">System Status</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
              <span className="font-medium text-gray-300">Database (PostgreSQL)</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">Online</span>
            </li>
            <li className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
              <span className="font-medium text-gray-300">API Gateway (Kong)</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">Online</span>
            </li>
            <li className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
              <span className="font-medium text-gray-300">Control Plane</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">Online</span>
            </li>
            <li className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
              <span className="font-medium text-gray-300">Auth (Custom)</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">Online</span>
            </li>
          </ul>
        </section>

        {/* Project Migration Panel */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Migrate Projects</h2>
          <p className="text-gray-400 mb-6 flex-1">
            Import your external projects directly into your secure, local ZimaOS environment.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleMigrateGitHub}
              disabled={migrationStatus.loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              Migrate from GitHub
            </button>
            <button
              onClick={handleMigrateLovable}
              disabled={migrationStatus.loading}
              className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Migrate from Lovable
            </button>
          </div>

          {migrationStatus.message && (
            <div className={`mt-6 p-4 rounded-lg border ${
              migrationStatus.type === 'success' ? 'bg-green-900/30 border-green-700 text-green-300' :
              migrationStatus.type === 'error' ? 'bg-red-900/30 border-red-700 text-red-300' :
              'bg-blue-900/30 border-blue-700 text-blue-300'
            }`}>
              {migrationStatus.message}
            </div>
          )}
        </section>

      </main>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>NeerCloud BaaS - Running 100% locally on ZimaOS. No external dependencies.</p>
      </footer>
    </div>
  );
}
