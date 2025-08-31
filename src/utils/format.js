export function num(v) {
  try { return Number(v).toLocaleString() } catch { return String(v) }
}

export function display(v) {
  return v && typeof v.toLocaleString === 'function' ? v.toLocaleString() : String(v)
}
