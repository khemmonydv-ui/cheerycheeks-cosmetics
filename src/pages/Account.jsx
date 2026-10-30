import { useState, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'

import OrdersSection from '../components/account/OrdersSection'
import './Account.css'

const menu = [
  { to: '/account', icon: 'ti-user', label: 'My profile', active: true },
  { to: '#orders', icon: 'ti-package', label: 'My orders' },
  { to: '#wishlist', icon: 'ti-heart', label: 'Wishlist' },
  { to: '#addresses', icon: 'ti-map-pin', label: 'Addresses' },
  { to: '#password', icon: 'ti-lock', label: 'Password' },
]


function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser'))
  } catch {
    return null
  }
}

function logOut() {
  localStorage.removeItem('currentUser')
}

function updateCurrentUser(changes) {
  const current = getCurrentUser()
  if (!current) throw new Error('You are not logged in.')

  const updated = { ...current, ...changes }

  try {
    localStorage.setItem('currentUser', JSON.stringify(updated))

    const accounts = JSON.parse(localStorage.getItem('accounts')) || []
    const next = accounts.map((a) => (a.email === current.email ? updated : a))
    localStorage.setItem('accounts', JSON.stringify(next))
  } catch {
    throw new Error('Could not save. The photo may be too large.')
  }

  return updated
}

// Crop the image to a centered square and shrink it so it fits in storage.
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const sx = (img.width - side) / 2
      const sy = (img.height - side) / 2

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, size, size)

      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read the image.'))
    }

    img.src = url
  })
}

// Not logged in -> go to the login page. Logged in -> show the profile.
export default function Account() {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  return <AccountPage user={user} />
}

function pick(user) {
  return {
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  }
}

function AccountPage({ user }) {
  const [lastSaved, setLastSaved] = useState({ form: pick(user), photo: user.photo || null })
  const [form, setForm] = useState(lastSaved.form)
  const [photo, setPhoto] = useState(lastSaved.photo)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    try {
      const updated = updateCurrentUser({ ...form, photo })
      setLastSaved({ form: pick(updated), photo: updated.photo || null })
      setSaveError('')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaved(false)
      setSaveError(err.message || 'Could not save.')
    }
  }

  function handleCancel() {
    setForm(lastSaved.form)
    setPhoto(lastSaved.photo)
    setPhotoError('')
    setSaveError('')
  }

  function handlePhotoClick() {
    fileInputRef.current.click()
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Image must be smaller than 10 MB.')
      return
    }

    try {
      setPhoto(await resizeImage(file))
      setPhotoError('')
    } catch (err) {
      setPhotoError(err.message)
    }
  }

  const initials = form.fullName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <main className="container account-layout">
      <nav className="account-menu" aria-label="Account">
        {menu.map((item) => (
          <a
            key={item.label}
            href={item.to}
            className={item.active ? 'is-active' : ''}
          >
            <i className={`ti ${item.icon}`}></i>
            {item.label}
          </a>
        ))}
        <Link to="/login" className="logout" onClick={logOut}>
          <i className="ti ti-logout"></i>
          Log out
        </Link>
      </nav>

      <div className="account-main">
        <section id="profile">
          <h1 className="page-title" style={{ marginBottom: 'var(--space-6)' }}>
            My profile
          </h1>

          <div className="profile-head" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="avatar" aria-hidden="true">
              {photo ? <img src={photo} alt="" /> : initials}
            </div>
            <div className="profile-who">
              <p className="name">{form.fullName}</p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handlePhotoClick}
              >
                Change photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
              {photoError && <p className="field-error">{photoError}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input className="input" type="text" id="fullName" autoComplete="name"
                  value={form.fullName} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input className="input" type="email" id="email" autoComplete="email"
                  value={form.email} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input className="input" type="tel" id="phone" autoComplete="tel"
                  value={form.phone} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="address">Address</label>
                <input className="input" type="text" id="address" autoComplete="street-address"
                  value={form.address} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save changes</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            <p
              className="field-error"
              role="status"
              style={{
                color: saveError ? undefined : 'var(--color-success)',
                marginTop: 'var(--space-3)',
              }}
            >
              {saveError || (saved ? 'Changes saved' : '')}
            </p>
          </form>
        </section>

        <OrdersSection user={user} />
      </div>
    </main>
  )
}