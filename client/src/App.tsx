import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { Brain } from 'lucide-react'
import RoadmapPage from './pages/RoadmapPage'
import ProblemsPage from './pages/ProblemsPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-0">
            <div className="flex items-center justify-between h-[80px]">
              <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                <Brain className="w-8 h-8 text-blue-600" />
                <span>Deep Learning Roadmap</span>
              </NavLink>
              <div className="flex items-center gap-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  Roadmap
                </NavLink>
                <NavLink
                  to="/problems"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  Problems
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<RoadmapPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
