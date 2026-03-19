import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

const ResultsTable = ({ results }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'borderline': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'abnormal': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'borderline': return <HelpCircle className="w-4 h-4" />;
      case 'abnormal': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Test Name</th>
              <th className="px-6 py-4">Your Value</th>
              <th className="px-6 py-4">Normal Range</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Summary</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((item, idx) => (
              <React.Fragment key={idx}>
                <tr 
                  onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-bold text-white">{item.test}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-lg text-primary">{item.value}</span>
                    <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item.normalRange}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate italic">
                    {item.plainEnglish}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {expandedRow === idx ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    )}
                  </td>
                </tr>
                {expandedRow === idx && (
                  <tr className="bg-primary/5">
                    <td colSpan="6" className="px-6 py-6 border-l-4 border-primary">
                      <div className="animate-fade-in">
                        <h4 className="text-primary font-bold uppercase text-xs tracking-widest mb-2">Deep Insights</h4>
                        <p className="text-gray-200 text-lg mb-4 leading-relaxed">{item.detail}</p>
                        
                        {item.concern && (
                          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                            <div>
                              <p className="text-red-500 font-bold text-sm uppercase mb-1">Potential Correlation</p>
                              <p className="text-gray-300 text-sm italic">{item.concern}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
