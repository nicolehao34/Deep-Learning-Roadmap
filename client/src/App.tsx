import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { Brain, LogOut } from 'lucide-react'
import RoadmapPage from './pages/RoadmapPage'
import ProblemsPage from './pages/ProblemsPage'
import ProblemSolvingPage from './pages/ProblemSolvingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center justify-between h-[80px]">
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Brain className="w-8 h-8 text-blue-600" />
            <span>InkSight's Deep Learning Roadmap</span>
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

            {user ? (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-slate-200">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <NavBar />
          <Routes>
            <Route path="/" element={<RoadmapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/problems"
              element={
                <ProtectedRoute>
                  <ProblemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problems/:id"
              element={
                <ProtectedRoute>
                  <ProblemSolvingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
