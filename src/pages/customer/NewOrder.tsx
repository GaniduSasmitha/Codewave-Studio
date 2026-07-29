import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewOrder() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mock Order Submitted!');
    navigate('/portal');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Request a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <div>
          <label className="block text-sm font-medium text-slate-300">Project Type</label>
          <select className="mt-1 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary">
            <option>Custom Web Application</option>
            <option>UI/UX Design System</option>
            <option>WebGL & 3D Interactive Design</option>
            <option>Mobile App Development</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Project Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary"
            placeholder="e.g. Acme Web Portal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Project Description</label>
          <textarea
            required
            className="mt-1 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-primary h-32"
            placeholder="Tell us about the design, functionality, and timing requirements..."
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/portal')}
            className="w-1/2 border border-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 bg-primary hover:bg-primary/95 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
}
