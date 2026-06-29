// Lightweight localStorage-backed override store for the admin dashboard.
// Each data module registers its built-in defaults; if the admin has saved an
// override for that collection, the override is returned instead. There is no
// backend — edits live in the visitor's browser via localStorage and are read
// fresh on each page mount, so admin changes show up as you navigate the site.

const PREFIX = 'brevitty_admin_'
const defaults = {}

function read(name) {
  try {
    const raw = window.localStorage.getItem(PREFIX + name)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

// Called by a data module at import time: stash its defaults and return the
// active list (override when present, otherwise the defaults).
export function registerCollection(name, defaultList) {
  defaults[name] = defaultList
  return read(name) || defaultList
}

export function getDefaults(name) {
  return defaults[name] || []
}

// Fresh read — used by pages on render so navigation reflects admin edits.
export function getCollection(name) {
  return read(name) || getDefaults(name)
}

export function saveCollection(name, list) {
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function resetCollection(name) {
  try {
    window.localStorage.removeItem(PREFIX + name)
  } catch {
    /* ignore */
  }
}
