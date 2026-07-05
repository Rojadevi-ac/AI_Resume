import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.error('Invalid file type. Please upload a PDF, DOCX, or Image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload a resume');
    if (!jd) return toast.error('Please enter a job description');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jd);

    try {
      const res = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Analysis complete!');
      navigate('/results', { state: { data: res.data.data, filename: file.name } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analyze Resume</h1>
          <p className="text-gray-500 mt-1">Upload your resume and the job description to get your ATS score.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Upload Resume</h2>
            
            {!file ? (
              <div 
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.png,.jpg,.jpeg"
                  onChange={handleChange} 
                />
                <UploadCloud className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, DOCX, PNG, JPG (max 10MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-4">
                    <File size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Job Description</h2>
            <textarea
              className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
              placeholder="Paste the job description here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !file || !jd}
              className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default UploadResume;
