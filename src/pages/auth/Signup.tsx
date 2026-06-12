import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signUp(email, password, username)
      toast.success('Account created! Check your email for confirmation.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Sign Up - ReelDB</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-reel-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold font-display">ReelDB</span>
            </Link>
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-dark-400 mt-1">Join the Tamil & Malayalam cinema community</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-xl p-6 border border-white/5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field pl-10" placeholder="yourname" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="••••••••" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-dark-400">
            Already have an account? <Link to="/login" className="text-reel-400 hover:text-reel-300">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
