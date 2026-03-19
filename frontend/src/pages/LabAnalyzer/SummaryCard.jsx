import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  const stats = [
    { label: 'Normal', count: summary.normal, color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: 'Borderline', count: summary.borderline, color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: <Info className="w-5 h-5" /> },
    { label: 'Abnormal', count: summary.abnormal, color: 'text-red-500', bg: 'bg-red-500/10', icon: <AlertCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
        <p className="text-gray-400 text-sm font-medium uppercase mb-1">Total Tests</p>
        <p className="text-3xl font-black text-white">{summary.total}</p>
      </div>
      
      {stats.map((stat, i) => (
        <div key={i} className={`glass-card p-6 rounded-2xl border-l-4 ${stat.label === 'Normal' ? 'border-green-500' : stat.label === 'Borderline' ? 'border-yellow-500' : 'border-red-500'}`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-400 text-sm font-medium uppercase">{stat.label}</p>
            <span className={stat.color}>{stat.icon}</span>
          </div>
          <p className={`text-3xl font-black ${stat.color}`}>{stat.count}</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">{stat.count > 0 ? `${stat.label} found` : 'No concerns'}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCard;
