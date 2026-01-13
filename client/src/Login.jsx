import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { KeyRound, Mail } from 'lucide-react'

// Initialize Supabase Client For Auth (Frontend Side)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      if (isSignUp) {
        // SIGN UP LOGIC
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('Account created! Logging you in...')
        if (data.user) onLogin(data.session)
      } else {
        // LOGIN LOGIC
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.session) onLogin(data.session)
      }
    } catch (error) {
      setMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">CampusWallet</h1>
          <p className="text-slate-500">Student Expense Tracker</p>
        </div>

        <h2 className="text-xl font-semibold mb-4">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@uni.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {isSignUp ? "Already have an ID?" : "New here?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}