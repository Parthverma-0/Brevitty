import { useState } from 'react'
// Import data modules for their side effect: each registers its defaults with
// the store, so getDefaults()/getCollection() below have something to return.
import '../data/events.js'
import '../data/mentorsFull.js'
import '../data/partners.js'
import '../data/startups.js'
import {
  getCollection,
  getDefaults,
  saveCollection,
  resetCollection,
} from '../data/store.js'

// ---- Access (no real auth — a hardcoded gate, as requested) ----
const ADMIN_EMAIL = 'brevittyincubationhub@gmail.com'
const ADMIN_PASSWORD = 'Brevitty@3214'
const AUTH_KEY = 'brevitty_admin_authed'

// ---- Collection schemas ----
const COLLECTIONS = [
  {
    key: 'events',
    label: 'Events',
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Event name', type: 'text' },
      { key: 'slug', label: 'Slug (URL id, e.g. my-event)', type: 'text' },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: ['Summit', 'Conference', 'Networking', 'Workshop', 'Masterclass', 'Demo Day'],
      },
      { key: 'dateLabel', label: 'Date label (e.g. July 3, 2026)', type: 'text' },
      { key: 'time', label: 'Time (e.g. 10:00 AM – 2:00 PM)', type: 'text' },
      { key: 'startsAt', label: 'Starts at (ISO, blank = recurring)', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'registerUrl', label: 'Registration / join link', type: 'url' },
      { key: 'image', label: 'Image URL', type: 'url' },
      { key: 'registered', label: 'Registered count', type: 'number' },
      { key: 'seatsLeft', label: 'Seats left', type: 'number' },
      { key: 'completed', label: 'Completed (past event)', type: 'checkbox' },
      { key: 'short', label: 'Short tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'agenda', label: 'Agenda — JSON list of {time, title}', type: 'json' },
      { key: 'speakers', label: 'Speakers — JSON list of {name, role, gradient}', type: 'json' },
    ],
  },
  {
    key: 'mentors',
    label: 'Mentors',
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'slug', label: 'Slug (URL id)', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Product', 'Fundraising', 'Marketing', 'Tech', 'Legal', 'Operations', 'Design'],
      },
      { key: 'photo', label: 'Photo URL', type: 'url' },
      { key: 'quote', label: 'Quote', type: 'text' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'list' },
      { key: 'companies', label: 'Companies (comma-separated)', type: 'list' },
      { key: 'gradient', label: 'Gradient — 2 hex colors, comma-separated', type: 'list' },
      { key: 'bio', label: 'Bio (one paragraph per line)', type: 'lines' },
      { key: 'helpWith', label: 'Help with — JSON list of {title, desc}', type: 'json' },
      { key: 'career', label: 'Career — JSON list of {company, role, years, impact}', type: 'json' },
      { key: 'testimonials', label: 'Testimonials — JSON list of {quote, founder, startup}', type: 'json' },
      { key: 'sessions', label: 'Sessions — JSON list of {name, slug}', type: 'json' },
    ],
  },
  {
    key: 'partners',
    label: 'Partners',
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'mark', label: 'Monogram (logo fallback, e.g. AWS)', type: 'text' },
      { key: 'color', label: 'Color (hex)', type: 'text' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Techkit', 'Institutional', 'Affiliate'],
      },
      { key: 'logo', label: 'Logo URL', type: 'url' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'website', label: 'Website', type: 'url' },
    ],
  },
  {
    key: 'startups',
    label: 'Our Startups',
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'mark', label: 'Monogram (logo fallback)', type: 'text' },
      { key: 'logo', label: 'Logo URL', type: 'url' },
      { key: 'bg', label: 'Background image URL', type: 'url' },
      { key: 'color', label: 'Color (hex)', type: 'text' },
      { key: 'sector', label: 'Sector (e.g. Foodtech)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'stage', label: 'Stage (e.g. Seed)', type: 'text' },
      { key: 'funding', label: 'Funding (e.g. $1.4M)', type: 'text' },
    ],
  },
]

// ---- Buffer <-> item transforms (the form edits plain strings) ----
function toBuffer(item, fields) {
  const b = {}
  for (const f of fields) {
    const v = item ? item[f.key] : undefined
    if (f.type === 'list') b[f.key] = Array.isArray(v) ? v.join(', ') : v || ''
    else if (f.type === 'lines') b[f.key] = Array.isArray(v) ? v.join('\n') : v || ''
    else if (f.type === 'json') b[f.key] = v != null ? JSON.stringify(v, null, 2) : '[]'
    else if (f.type === 'checkbox') b[f.key] = !!v
    else if (f.type === 'number') b[f.key] = v ?? 0
    else b[f.key] = v ?? ''
  }
  return b
}

function blankBuffer(fields) {
  const b = {}
  for (const f of fields) {
    if (f.type === 'checkbox') b[f.key] = false
    else if (f.type === 'number') b[f.key] = 0
    else if (f.type === 'json') b[f.key] = '[]'
    else if (f.key === 'gradient') b[f.key] = '#f97316, #db2777'
    else b[f.key] = ''
  }
  return b
}

// Throws (with a helpful message) if a JSON field is malformed.
function fromBuffer(buf, fields) {
  const out = {}
  for (const f of fields) {
    const v = buf[f.key]
    if (f.type === 'list') {
      out[f.key] = String(v || '').split(',').map((s) => s.trim()).filter(Boolean)
    } else if (f.type === 'lines') {
      out[f.key] = String(v || '').split('\n').map((s) => s.trim()).filter(Boolean)
    } else if (f.type === 'json') {
      try {
        out[f.key] = JSON.parse(v || '[]')
      } catch {
        throw new Error(`"${f.label}" is not valid JSON.`)
      }
    } else if (f.type === 'checkbox') {
      out[f.key] = !!v
    } else if (f.type === 'number') {
      out[f.key] = Number(v) || 0
    } else {
      out[f.key] = v
    }
  }
  if ('startsAt' in out && !out.startsAt) out.startsAt = null
  return out
}

// ---- Login gate ----
function LoginGate({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      onAuthed()
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08070a] px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8"
      >
        <h1 className="font-display text-2xl font-bold text-white">
          brevitty<span className="text-orange">.</span> admin
        </h1>
        <p className="mt-1 text-sm text-white/50">Sign in to manage site content.</p>

        <label className="mt-6 block text-[11px] font-semibold uppercase tracking-wide text-white/45">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-orange"
          placeholder="you@email.com"
        />

        <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-white/45">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-orange"
          placeholder="••••••••"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-orange py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          Sign in →
        </button>
      </form>
    </div>
  )
}

// ---- One editable field ----
function Field({ field, value, onChange }) {
  const base =
    'mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange'

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-orange"
        />
        {field.label}
      </label>
    )
  }

  const label = (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-black/45">
      {field.label}
    </span>
  )

  if (field.type === 'select') {
    return (
      <label className="block">
        {label}
        <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'textarea' || field.type === 'lines') {
    return (
      <label className="block">
        {label}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === 'lines' ? 4 : 3}
          className={`${base} resize-y`}
        />
      </label>
    )
  }

  if (field.type === 'json') {
    return (
      <label className="block sm:col-span-2">
        {label}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          spellCheck={false}
          className={`${base} resize-y font-mono text-xs`}
        />
      </label>
    )
  }

  return (
    <label className="block">
      {label}
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange(field.type === 'number' ? e.target.value : e.target.value)}
        className={base}
      />
    </label>
  )
}

// ---- Editor for one collection ----
function CollectionEditor({ collection }) {
  const { key, fields, titleKey } = collection
  const [items, setItems] = useState(() => getCollection(key).map((it) => toBuffer(it, fields)))
  const [open, setOpen] = useState(() => new Set())
  const [msg, setMsg] = useState(null)

  const flash = (text, ok = true) => {
    setMsg({ text, ok })
    window.clearTimeout(flash._t)
    flash._t = window.setTimeout(() => setMsg(null), 4000)
  }

  const setField = (i, fk, val) => {
    setItems((prev) => {
      const next = prev.slice()
      next[i] = { ...next[i], [fk]: val }
      return next
    })
  }

  const addItem = () => {
    setItems((prev) => [blankBuffer(fields), ...prev])
    setOpen((prev) => new Set([0, ...[...prev].map((n) => n + 1)]))
  }

  const removeItem = (i) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
    setOpen(new Set())
  }

  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const save = () => {
    try {
      const list = items.map((buf) => fromBuffer(buf, fields))
      saveCollection(key, list)
      flash(`Saved ${list.length} ${collection.label.toLowerCase()}. Refresh public pages to see changes.`)
    } catch (err) {
      flash(err.message || 'Could not save — check your JSON fields.', false)
    }
  }

  const reset = () => {
    if (!window.confirm(`Reset ${collection.label} to the built-in defaults? This discards your edits.`)) {
      return
    }
    resetCollection(key)
    setItems(getDefaults(key).map((it) => toBuffer(it, fields)))
    setOpen(new Set())
    flash(`${collection.label} reset to defaults.`)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink">
          {collection.label}{' '}
          <span className="text-sm font-medium text-black/40">({items.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addItem}
            className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            + Add {collection.label.replace(/s$/, '')}
          </button>
          <button
            onClick={save}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Save changes
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/55 hover:border-black/30"
          >
            Reset to defaults
          </button>
        </div>
      </div>

      {msg && (
        <p
          className={`mt-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
            msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="mt-5 space-y-3">
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/40">
            None yet. Click “Add” to create one, then “Save changes”.
          </p>
        )}

        {items.map((buf, i) => {
          const isOpen = open.has(i)
          return (
            <div key={i} className="overflow-hidden rounded-xl border border-black/10 bg-white">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <button
                  onClick={() => toggle(i)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="text-black/30">{isOpen ? '▾' : '▸'}</span>
                  <span className="truncate font-medium text-ink">
                    {buf[titleKey] || <span className="text-black/35">Untitled</span>}
                  </span>
                </button>
                <button
                  onClick={() => removeItem(i)}
                  className="shrink-0 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              {isOpen && (
                <div className="grid grid-cols-1 gap-4 border-t border-black/10 p-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <div key={f.key} className={f.type === 'json' ? 'sm:col-span-2' : ''}>
                      <Field
                        field={f}
                        value={buf[f.key]}
                        onChange={(val) => setField(i, f.key, val)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [tab, setTab] = useState(COLLECTIONS[0].key)

  if (!authed) return <LoginGate onAuthed={() => setAuthed(true)} />

  const active = COLLECTIONS.find((c) => c.key === tab)

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* top bar */}
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-lg font-bold text-ink">
              brevitty<span className="text-orange">.</span> admin
            </h1>
            <p className="text-xs text-black/45">Content manager · changes save to this browser</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm font-medium text-black/55 hover:text-ink"
            >
              View site ↗
            </a>
            <button
              onClick={logout}
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/55 hover:border-black/30"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 pb-3">
          {COLLECTIONS.map((c) => (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === c.key
                  ? 'bg-orange text-white'
                  : 'border border-black/10 text-black/55 hover:border-black/25 hover:text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* key remounts the editor on tab switch so it reloads fresh state */}
        <CollectionEditor key={active.key} collection={active} />
      </main>
    </div>
  )
}
