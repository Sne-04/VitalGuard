import React, { useCallback } from 'react';
import { Upload, File, X, Loader } from 'lucide-react';

const UploadZone = ({ file, setFile, loading }) => {
  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="glass-card p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer relative">
      <input
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={loading}
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        {file ? (
          <div className="space-y-4">
            <div className="bg-primary/20 p-4 rounded-full mx-auto">
              <File className="w-12 h-12 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-1 truncate max-w-xs">{file.name}</p>
              <p className="text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={clearFile}
              className="text-red-500 hover:text-red-400 font-medium flex items-center gap-1 mx-auto"
            >
              <X className="w-4 h-4" />
              Remove File
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload your lab report</h3>
            <p className="text-gray-400 max-w-sm">
              Drag & drop your blood test PDF here, or click to browse files
            </p>
            <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">Supports digital PDF (Max 10MB)</p>
          </>
        )}
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
          <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-xl font-bold text-white">Reading your report...</p>
          <p className="text-gray-400 mt-2">AI is analyzing {file?.results?.length || ''} medical values</p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
