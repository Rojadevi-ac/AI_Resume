import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { Clock, Search, ChevronRight } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/resume/history');
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.filename.toLowerCase().includes(search.toLowerCase()) ||
    item.job_description.toLowerCase().includes(search.toLowerCase())
  );

  const viewResult = (item) => {
    navigate('/results', { state: { data: item, filename: item.filename } });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-500 mt-1">Review your past resume scans and improvements.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-sm text-gray-500">{filteredHistory.length} records</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading history...</div>
            ) : filteredHistory.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Document</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Keywords Matched</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredHistory.map((item, index) => (
                    <motion.tr 
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      onClick={() => viewResult(item)}
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900 truncate max-w-xs">{item.filename}</div>
                      </td>
                      <td className="p-4 text-gray-500 text-sm flex items-center">
                        <Clock size={14} className="mr-2" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          item.score >= 80 ? 'bg-green-100 text-green-700' : 
                          item.score >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {Math.round(item.score)}%
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {item.matched_skills.length} / {item.matched_skills.length + item.missing_skills.length}
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-blue-600 font-medium text-sm flex items-center justify-end w-full group-hover:underline">
                          View <ChevronRight size={16} className="ml-1" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p>No history found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;
