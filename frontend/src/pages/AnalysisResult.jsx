import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import axios from 'axios';

const AnalysisResult = () => {
  const location = useLocation();
  const { data, filename } = location.state || {};

  if (!data) {
    return <Navigate to="/upload" />;
  }

  const { score, matched_skills, missing_skills, suggestions } = data;

  const chartData = [
    { name: 'Matched', value: score },
    { name: 'Missing', value: 100 - score },
  ];

  const COLORS = ['#10b981', '#f3f4f6'];

  let scoreColor = 'text-green-500';
  if (score < 50) scoreColor = 'text-red-500';
  else if (score < 80) scoreColor = 'text-orange-500';

  const handleDownload = async () => {
    try {
      const res = await axios.get(`/api/resume/report/${data._id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SmartResume_Report_${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Result</h1>
            <p className="text-gray-500 mt-1">For {filename}</p>
          </div>
          <div className="flex space-x-4">
            {data._id && (
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                Download PDF
              </button>
            )}
            <Link to="/upload" className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">
              <ArrowLeft size={16} className="mr-2" /> Analyze Another
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">ATS Compatibility</h3>
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{Math.round(score)}%</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              {score >= 80 ? 'Excellent Match!' : score >= 50 ? 'Good Match. Needs improvement.' : 'Poor Match. Needs major revision.'}
            </p>
          </motion.div>

          {/* Suggestions Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <Lightbulb className="mr-2 text-yellow-500" /> Improvement Suggestions
            </h3>
            <div className="space-y-4">
              {suggestions.map((sug, idx) => (
                <div key={idx} className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800">
                  {sug}
                </div>
              ))}
              {suggestions.length === 0 && (
                <p className="text-gray-500">No suggestions available at this time.</p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Matched Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="mr-2 text-green-500" /> Matched Keywords ({matched_skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {matched_skills.length > 0 ? (
                matched_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No matched keywords found.</p>
              )}
            </div>
          </motion.div>

          {/* Missing Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <XCircle className="mr-2 text-red-500" /> Missing Keywords ({missing_skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {missing_skills.length > 0 ? (
                missing_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No missing keywords! Perfect match.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisResult;
