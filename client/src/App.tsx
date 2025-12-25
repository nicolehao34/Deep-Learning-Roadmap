import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Brain } from 'lucide-react'
import RoadmapPage from './pages/RoadmapPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                <Brain className="w-8 h-8 text-blue-600" />
                <span>Deep Learning Roadmap</span>
              </Link>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<RoadmapPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
