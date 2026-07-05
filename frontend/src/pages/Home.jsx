import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center space-y-8"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          AI-Based <span className="text-blue-400">Smart Resume</span> Analyzer
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 font-light">
          Unlock your career potential. Compare your resume against any job description, get an instant ATS score, and receive AI-driven actionable insights.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          {user ? (
            <Link to="/dashboard" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1">
                Get Started
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full shadow-lg transition-all transform hover:-translate-y-1">
                Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Home;
