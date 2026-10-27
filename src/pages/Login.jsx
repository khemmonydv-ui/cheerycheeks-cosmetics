import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import accountsData from '../data/accounts.json'
import './Signup.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    const saved = JSON.parse(localStorage.getItem('accounts')) || []
    const all = [...accountsData, ...saved]

    const user = all.find(
      (a) =>
        a.email === form.email &&
      // Account from JSON without password → Accept via email only
        (a.password === undefined || a.password === form.password)
    )

    if (!user) {
      setError('Email or password is incorrect.')
      return
    }

    localStorage.setItem('currentUser', JSON.stringify(user))
    navigate('/account')
  }

  return (
    <main className="signup-page">
      <div className="container">
        <form className="signup-card" onSubmit={handleSubmit}>
          <div className="signup-head">
            <p className="eyebrow">Cherry Cheeks</p>
            <h1 className="signup-title">Welcome back</h1>
            <p className="signup-sub">Log in to your account.</p>
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>
            <input className="input" id="email" type="email" placeholder="name@email.com"
              autoComplete="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input className="input" id="password" type="password" placeholder="Enter your password"
              autoComplete="current-password" value={form.password} onChange={handleChange} required />
          </div>

          {error && <p className="signup-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block">Log in</button>

          <p className="signup-switch">
            No account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </main>
  )
}