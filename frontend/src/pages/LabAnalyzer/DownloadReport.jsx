import React from 'react';
import { FileDown, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DownloadReport = ({ reportId, printRef }) => {
  const downloadPDF = async () => {
    const element = printRef.current;
    
    // Temporarily apply white background and black text for cleaner PDF
    const originalStyle = element.getAttribute('style');
    element.style.backgroundColor = 'white';
    element.style.color = 'black';
    // Deep search for all glass-cards and force visibility
    const cards = element.querySelectorAll('.glass-card');
    cards.forEach(c => {
        c.style.backgroundColor = '#f9fafb';
        c.style.borderColor = '#e5e7eb';
        c.style.color = 'black';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Restore style
    element.setAttribute('style', originalStyle || '');
    cards.forEach(c => c.removeAttribute('style'));

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`VitalGuard_Laboratory_Analysis_${reportId.substring(0, 8)}.pdf`);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={downloadPDF}
        className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-primary/40"
      >
        <FileDown className="w-5 h-5" />
        <span>Export Clinical PDF</span>
      </button>
      <button
        onClick={() => window.print()}
        className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
      >
        <Printer className="w-5 h-5 text-gray-400" />
        <span>Print</span>
      </button>
    </div>
  );
};

export default DownloadReport;
