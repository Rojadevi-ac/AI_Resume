import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { FileText, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const chartData = history.slice(0, 10).reverse().map((item, index) => ({
    name: `Scan ${index + 1}`,
    score: item.score
  }));

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) 
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your resume performance</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Scans</p>
              <h3 className="text-2xl font-bold text-gray-900">{history.length}</h3>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average ATS Score</p>
              <h3 className="text-2xl font-bold text-gray-900">{averageScore}%</h3>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Recent Score</p>
              <h3 className="text-2xl font-bold text-gray-900">{history[0]?.score || 0}%</h3>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Score Progression</h3>
            {history.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-gray-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>No scan history yet</p>
                <Link to="/upload" className="mt-4 text-blue-600 hover:underline">Start a scan</Link>
              </div>
            )}
          </motion.div>

          {/* Recent History */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Scans</h3>
              <Link to="/history" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : history.length > 0 ? (
                history.slice(0, 5).map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center overflow-hidden">
                      <Clock size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.filename}</p>
                        <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      item.score >= 80 ? 'bg-green-100 text-green-700' : 
                      item.score >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.score}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent scans.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
