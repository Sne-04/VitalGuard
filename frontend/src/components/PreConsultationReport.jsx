import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileDown, Printer, Activity } from 'lucide-react';

const PreConsultationReport = ({ prediction, user }) => {
    const reportRef = useRef();

    const generatePDF = async () => {
        const element = reportRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`VitalGuard_Report_${prediction._id || 'new'}.pdf`);
    };

    if (!prediction || !user) return null;

    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={generatePDF}
                className="btn-primary flex items-center space-x-2 px-6 py-3 rounded-xl hover:scale-105 transition-transform"
            >
                <FileDown className="w-5 h-5" />
                <span>Download Clinical Report (PDF)</span>
            </button>

            {/* Hidden Report Template for PDF Generation */}
            <div className="overflow-hidden h-0 w-0">
                <div
                    ref={reportRef}
                    className="w-[210mm] p-[20mm] bg-white text-black font-serif leading-relaxed"
                    style={{ minHeight: '297mm' }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight uppercase">VitalGuard AI</h1>
                            <p className="text-sm font-medium text-gray-600 mt-1">Advanced Health Analysis & Triage System</p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="font-bold">REPORT ID: {(prediction._id || 'TEMP').substring(0, 8).toUpperCase()}</p>
                            <p>DATE: {new Date(prediction.createdAt || Date.now()).toLocaleDateString()}</p>
                            <p>TIME: {new Date(prediction.createdAt || Date.now()).toLocaleTimeString()}</p>
                        </div>
                    </div>

                    {/* Patient Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase tracking-wider border-l-4 border-black">
                            Patient Information
                        </h2>
                        <div className="grid grid-cols-3 gap-6 px-3">
                            <div>
                                <p className="text-xs uppercase text-gray-500 font-bold">Name</p>
                                <p className="font-medium">{user.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500 font-bold">Age / Gender</p>
                                <p className="font-medium">{prediction.patientInfo?.age || user.age || 'N/A'}Y / {prediction.patientInfo?.gender || user.gender || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500 font-bold">Consultation Type</p>
                                <p className="font-medium text-blue-800">PRE-CONSULTATION AI ANALYSIS</p>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Summary */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase tracking-wider border-l-4 border-black">
                            Symptom Profile
                        </h2>
                        <div className="px-3 space-y-4">
                            <div>
                                <p className="text-xs uppercase text-gray-500 font-bold mb-1">Reported Symptoms</p>
                                <div className="flex flex-wrap gap-2">
                                    {prediction.symptoms.map((s, i) => (
                                        <span key={i} className="border border-black px-2 py-0.5 text-sm uppercase">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs uppercase text-gray-500 font-bold">Duration</p>
                                    <p className="font-medium">{prediction.symptomDuration} Days</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-gray-500 font-bold">Primary Concern</p>
                                    <p className="font-medium uppercase">{prediction.symptoms[0] || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Assessment */}
                    <div className="mb-8 p-6 border-2 border-black">
                        <h2 className="text-xl font-bold mb-4 uppercase text-center border-b border-black pb-2">
                            AI Diagnostic Assessment
                        </h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center border-r border-black pr-4">
                                <p className="text-xs uppercase text-gray-500 font-bold mb-1">Predicted Condition</p>
                                <p className="text-2xl font-bold leading-tight">{prediction.disease.name}</p>
                                <p className="text-sm mt-1">Confidence Score: <span className="font-bold">{prediction.disease.confidence.toFixed(1)}%</span></p>
                            </div>
                            <div className="text-center pl-4">
                                <p className="text-xs uppercase text-gray-500 font-bold mb-1">Severity Assessment</p>
                                <p className={`text-2xl font-bold uppercase ${
                                    prediction.severity.level === 'Severe' ? 'text-red-700' :
                                    prediction.severity.level === 'Moderate' ? 'text-yellow-600' :
                                    'text-green-700'
                                }`}>
                                    {prediction.severity.level}
                                </p>
                                <p className="text-sm mt-1">Index: <span className="font-bold">{prediction.severity.confidence.toFixed(1)}%</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Triage & Recommendation */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase tracking-wider border-l-4 border-black">
                            Triage Recommendation
                        </h2>
                        <div className="px-3">
                            <div className={`text-xl font-bold mb-2 uppercase p-2 border ${
                                prediction.triage.level === 'EMERGENCY' ? 'bg-red-50 border-red-900 text-red-900' :
                                prediction.triage.level === 'VISIT_DOCTOR' ? 'bg-yellow-50 border-yellow-800 text-yellow-800' :
                                'bg-green-50 border-green-800 text-green-800'
                            }`}>
                                {prediction.triage.title}
                            </div>
                            <p className="text-sm font-medium italic mb-4">{prediction.triage.message}</p>
                            
                            <p className="text-xs uppercase text-gray-500 font-bold mb-2">Recommended Actions</p>
                            <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                                {prediction.triage.actions?.map((action, i) => (
                                    <li key={i}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Risk Timeline */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase tracking-wider border-l-4 border-black">
                            7-Day Risk Timeline
                        </h2>
                        <table className="w-full text-left border-collapse border border-black text-sm px-3">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-black p-2 font-bold uppercase">Day</th>
                                    <th className="border border-black p-2 font-bold uppercase">Risk Score</th>
                                    <th className="border border-black p-2 font-bold uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prediction.riskTimeline.timeline.map((t, i) => (
                                    <tr key={i}>
                                        <td className="border border-black p-2">Day {t.day}</td>
                                        <td className="border border-black p-2">{t.risk_score}%</td>
                                        <td className="border border-black p-2 uppercase font-medium">{t.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 grid grid-cols-2 text-xs">
                            <p><strong>PEAK RISK:</strong> DAY {prediction.riskTimeline.peak_risk_day}</p>
                            <p className="text-right text-gray-600 italic">Analysis based on current symptoms trend: {prediction.riskTimeline.trend}</p>
                        </div>
                    </div>

                    {/* Symptom Influence (SHAP) */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase tracking-wider border-l-4 border-black">
                            Top 5 Predictive Indicators (SHAP)
                        </h2>
                        <div className="px-3 space-y-2">
                            {prediction.explainability.topFeatures?.slice(0, 5).map((f, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-32 text-xs font-bold uppercase">{f.feature}</div>
                                    <div className="flex-1 bg-gray-200 h-2 ml-4">
                                        <div 
                                            className="bg-black h-full" 
                                            style={{ width: `${Math.min(100, (f.contribution / Math.max(...prediction.explainability.topFeatures.map(x=>x.contribution))) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="ml-4 text-xs font-mono">{(f.contribution * 10).toFixed(2)}</div>
                                </div>
                            ))}
                            <p className="text-[10px] text-gray-500 mt-2 italic">
                                *Contribution values indicate the relative weight of each symptom to the AI's final prediction.
                            </p>
                        </div>
                    </div>

                    {/* Personal Recommendations */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase tracking-wider border-l-4 border-black">
                            Personalized Recommendations
                        </h2>
                        <div className="px-3 space-y-2">
                            {prediction.riskTimeline.recommendations?.map((item, i) => (
                                <p key={i} className="text-sm">• {item}</p>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-auto pt-8 border-t border-gray-300 text-center">
                        <p className="text-[10px] font-bold text-red-900 uppercase tracking-widest mb-1">
                            ⚠️ Medical Disclaimer
                        </p>
                        <p className="text-[9px] text-gray-600 uppercase max-w-2xl mx-auto leading-tight">
                            This document is generated by an Artificial Intelligence system for pre-consultation information only. 
                            It is NOT a medical diagnosis, clinical opinion, or professional advice. 
                            If you are experiencing a medical emergency, call regional emergency services immediately. 
                            VITALGUARD IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL CONSULTATION.
                        </p>
                        <p className="text-[9px] text-gray-400 mt-4">
                            Generated by VitalGuard AI Engine v1.0.0 • {new Date().toISOString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreConsultationReport;
