/**
 * Opens the browser print dialog with `name` as the default PDF filename.
 *
 * Browsers use `document.title` as the suggested filename in "Save as PDF", so we
 * swap the title just for the print and restore it afterwards (on `afterprint`,
 * with a timeout fallback for browsers that never fire the event).
 *
 * Resolves once the print dialog is closed (or the fallback fires), so callers
 * can keep their button locked for the whole print.
 */
export function printDocument(name?: string): Promise<void> {
  const clean = (name || '')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, ' ') // strip characters illegal in filenames
    .replace(/\s+/g, ' ')
    .trim()

  return new Promise(resolve => {
    const previous = document.title
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      document.title = previous
      window.removeEventListener('afterprint', restore)
      resolve()
    }

    if (clean) document.title = clean
    window.addEventListener('afterprint', restore)
    window.print()
    setTimeout(restore, 1500)
  })
}
