import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import accountsData from '../data/accounts.json'
import './Signup.css'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    const saved = JSON.parse(localStorage.getItem('accounts')) || []
    const all = [...accountsData, ...saved]

    if (all.some((a) => a.email.toLowerCase() === form.email.toLowerCase())) {
      setError('This email is already registered.')
      return
    }

    const { confirm, ...rest } = form
    const newUser = { id: Date.now(), ...rest, role: 'CUSTOMER', active: true }

    localStorage.setItem('accounts', JSON.stringify([...saved, newUser]))
    localStorage.setItem('currentUser', JSON.stringify(newUser))

    navigate('/account')
  }

  return (
    <main className="signup-page">
      <div className="container">
        <form className="signup-card" onSubmit={handleSubmit}>
          <div className="signup-head">
            <p className="eyebrow">Cherry Cheeks</p>
            <h1 className="signup-title">Create your account</h1>
            <p className="signup-sub">Join us and start shopping.</p>
          </div>

          <div className="signup-field">
            <label htmlFor="fullName">Full name</label>
            <input className="input" id="fullName" type="text" placeholder="Your full name"
              autoComplete="name" value={form.fullName} onChange={handleChange} required />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>
            <input className="input" id="email" type="email" placeholder="name@email.com"
              autoComplete="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="signup-field">
            <label htmlFor="phone">Phone</label>
            <input className="input" id="phone" type="tel" placeholder="+855 12 345 678"
              autoComplete="tel" value={form.phone} onChange={handleChange} required />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input className="input" id="password" type="password" placeholder="At least 6 characters"
              autoComplete="new-password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="signup-field">
            <label htmlFor="confirm">Confirm password</label>
            <input className="input" id="confirm" type="password" placeholder="Enter your password again"
              autoComplete="new-password" value={form.confirm} onChange={handleChange} required />
          </div>

          {error && <p className="signup-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block">Sign up</button>

          <p className="signup-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </main>
  )
}